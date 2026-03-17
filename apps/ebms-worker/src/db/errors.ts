/** Detect if error is due to missing employee_notifications table (local/remote DB sync) */
export function isEmployeeNotificationsTableMissing(error: unknown): boolean {
  const msg = String(error).toLowerCase();
  const cause =
    error &&
    typeof error === "object" &&
    "cause" in error &&
    error.cause &&
    typeof (error.cause as { message?: unknown }).message === "string"
      ? String((error.cause as { message: string }).message).toLowerCase()
      : "";
  const full = `${msg} ${cause}`;
  return (
    full.includes("employee_notifications") &&
    (full.includes("no such table") || full.includes("no such column"))
  );
}
