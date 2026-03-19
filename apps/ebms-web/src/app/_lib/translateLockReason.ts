/** Translates known Mongolian lock/reason strings to English */
export function translateLockReason(text: string): string {
  const map: Record<string, string> = {
    "Хүсэлт илгээх хугацаа дууссан": "Request period expired",
    "Гэрээний хугацаа дууссан": "Contract period expired",
  };
  return map[text] ?? text;
}
