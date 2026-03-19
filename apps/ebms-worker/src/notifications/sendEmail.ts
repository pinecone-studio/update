/**
 * Resend email integration for EBMS notifications.
 * Requires RESEND_API_KEY secret and RESEND_FROM_EMAIL var.
 */

import { Resend } from "resend";

export type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  idempotencyKey?: string;
};

/**
 * Send an email via Resend.
 * Returns the email id on success, throws on error.
 */
export async function sendEmailViaResend(
  apiKey: string,
  from: string,
  params: SendEmailParams,
): Promise<string | null> {
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html ?? `<p>${params.text.replace(/\n/g, "<br>")}</p>`,
    ...(params.idempotencyKey && {
      idempotencyKey: params.idempotencyKey,
    }),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data?.id ?? null;
}
