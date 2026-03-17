export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export type Tone = "yellow" | "green" | "blue" | "purple";

export function toneClass(tone: Tone): string {
  const map: Record<Tone, string> = {
    yellow: "border-[#FFAD0F]/40 bg-[#FFAD0F]/20 text-[#FFAD0F]",
    green: "border-[#00C95F]/40 bg-[#00C95F]/20 text-[#00C95F]",
    blue: "border-[#2A8BFF]/40 bg-[#2A8BFF]/20 text-[#2A8BFF]",
    purple: "border-[#9C27B0]/40 bg-[#9C27B0]/20 text-[#9C27B0]",
  };
  return map[tone];
}

export function getIconSymbol(icon: string): string {
  switch (icon) {
    case "check":
      return "✓";
    case "wallet":
      return "◫";
    case "trend":
      return "↗";
    default:
      return "!";
  }
}
