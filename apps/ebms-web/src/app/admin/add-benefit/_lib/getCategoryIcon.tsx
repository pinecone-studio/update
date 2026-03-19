import type { ReactNode } from "react";
import {
  MdFitnessCenter,
  MdHealthAndSafety,
  MdLaptop,
  MdWorkspacePremium,
  MdDesignServices,
  MdHome,
  MdWork,
  MdTrendingUp,
  MdSchedule,
} from "react-icons/md";

/** Benefit category-аас icon-ийг буцаана (employee талтай ижил) */
export function getCategoryIcon(category: string): ReactNode {
  const key = category.trim().toLowerCase();
  switch (key) {
    case "wellness":
      return <MdFitnessCenter size={20} />;
    case "health":
      return <MdHealthAndSafety size={20} />;
    case "equipment":
      return <MdLaptop size={20} />;
    case "career":
    case "career development":
      return <MdWorkspacePremium size={20} />;
    case "tools":
      return <MdDesignServices size={20} />;
    case "financial":
      return <MdHome size={20} />;
    case "workplace":
      return <MdWork size={20} />;
    case "performance":
      return <MdTrendingUp size={20} />;
    case "flexibility":
      return <MdSchedule size={20} />;
    default:
      return <MdFitnessCenter size={20} />;
  }
}
