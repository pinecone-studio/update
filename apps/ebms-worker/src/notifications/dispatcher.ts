import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import { isEmployeeNotificationsTableMissing } from "../db/errors";
import { employeeNotifications, employees } from "../db/schema";
import { and, eq, gte } from "drizzle-orm";
import { sendEmailViaResend } from "./sendEmail";

export type NotificationType =
  | "ELIGIBILITY_CHANGE"
  | "REQUEST_STATUS"
  | "WARNING";

export type NotificationTone = "success" | "info" | "warning" | "neutral";

export type NotificationChannel = "in_app" | "email";

type DispatchInput = {
  employeeId: string;
  title: string;
  body: string;
  type: NotificationType;
  tone?: NotificationTone;
  dedupeKey?: string | null;
  metadata?: Record<string, unknown> | null;
};

const DEDUPE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

async function hasRecentDuplicate(
  env: Env,
  employeeId: string,
  dedupeKey: string,
): Promise<boolean> {
  try {
    const db = getDb(env);
    const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
    const rows = await db
      .select({ id: employeeNotifications.id })
      .from(employeeNotifications)
      .where(
        and(
          eq(employeeNotifications.employeeId, employeeId),
          eq(employeeNotifications.dedupeKey, dedupeKey),
          gte(employeeNotifications.createdAt, since),
        ),
      )
      .limit(1);
    return Boolean(rows[0]);
  } catch (err) {
    if (isEmployeeNotificationsTableMissing(err)) return false;
    throw err;
  }
}

async function insertNotification(
  env: Env,
  input: DispatchInput,
  channel: NotificationChannel,
  deliveryStatus: "delivered" | "queued" | "failed",
  isRead: number,
): Promise<void> {
  const db = getDb(env);
  const now = new Date().toISOString();
  await db.insert(employeeNotifications).values({
    id: crypto.randomUUID(),
    employeeId: input.employeeId,
    title: input.title,
    body: input.body,
    type: input.type,
    tone: input.tone ?? "info",
    channel,
    deliveryStatus,
    isRead,
    dedupeKey: input.dedupeKey ?? null,
    metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
    createdAt: now,
  });
}

export async function dispatchEmployeeNotification(
  env: Env,
  input: DispatchInput,
): Promise<void> {
  try {
    if (input.dedupeKey) {
      const skip = await hasRecentDuplicate(
        env,
        input.employeeId,
        input.dedupeKey,
      );
      if (skip) return;
    }

    await insertNotification(env, input, "in_app", "delivered", 0);

    let emailStatus: "delivered" | "queued" | "failed" = "queued";
    if (env.RESEND_API_KEY && env.RESEND_FROM_EMAIL) {
      try {
        const db = getDb(env);
        const [emp] = await db
          .select({ email: employees.email })
          .from(employees)
          .where(eq(employees.id, input.employeeId))
          .limit(1);

        if (emp?.email?.trim()) {
          await sendEmailViaResend(
            env.RESEND_API_KEY,
            env.RESEND_FROM_EMAIL,
            {
              to: emp.email.trim(),
              subject: input.title,
              text: input.body,
              idempotencyKey: input.dedupeKey
                ? `ebms-notif-${input.dedupeKey}`
                : undefined,
            },
          );
          emailStatus = "delivered";
        }
      } catch (err) {
        console.error("[notification] Resend failed:", err);
        emailStatus = "failed";
      }
    } else {
      console.log(
        `[notification] email skipped (no RESEND_API_KEY/RESEND_FROM_EMAIL): ${input.employeeId} — ${input.title}`,
      );
    }

    await insertNotification(env, input, "email", emailStatus, 1);
  } catch (err) {
    if (isEmployeeNotificationsTableMissing(err)) {
      return; // Graceful fallback when local/remote DB lacks employee_notifications
    }
    throw err;
  }
}

export async function dispatchEmployeeWarningsIfNeeded(
  env: Env,
  employeeId: string,
  employee: {
    employmentStatus?: string;
    okrSubmitted?: boolean;
    lateArrivalCount?: number;
  },
): Promise<void> {
  const now = new Date();
  const monthKey = `${now.getUTCFullYear()}-${String(
    now.getUTCMonth() + 1,
  ).padStart(2, "0")}`;

  if ((employee.lateArrivalCount ?? 0) >= 2) {
    await dispatchEmployeeNotification(env, {
      employeeId,
      type: "WARNING",
      tone: "warning",
      dedupeKey: `warning:attendance:${monthKey}`,
      title: "Attendance Warning",
      body: "You have 2 late arrivals in the last 30 days. If you reach 3 late arrivals, some benefits will be locked.",
      metadata: { lateArrivalCount: employee.lateArrivalCount ?? 0 },
    });
  }

  if (employee.okrSubmitted === false) {
    await dispatchEmployeeNotification(env, {
      employeeId,
      type: "WARNING",
      tone: "warning",
      dedupeKey: `warning:okr:${monthKey}`,
      title: "OKR Submission Missing",
      body: "Your OKR submission is still missing. Please submit to avoid benefit restrictions.",
    });
  }

  if ((employee.employmentStatus ?? "").toLowerCase() === "probation") {
    await dispatchEmployeeNotification(env, {
      employeeId,
      type: "WARNING",
      tone: "warning",
      dedupeKey: `warning:probation:${monthKey}`,
      title: "Probation Status",
      body: "You are currently on probation. Some benefits may remain locked until probation ends.",
    });
  }
}
