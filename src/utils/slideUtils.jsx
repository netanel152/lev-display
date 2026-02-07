export const getFontSize = (text) => {
  if (!text) return "text-4xl md:text-7xl lg:text-8xl xl:text-[9rem]";
  const len = text.length;
  // Short names (e.g. "אברהם כהן") - Massive impact
  if (len < 12) return "text-4xl md:text-7xl lg:text-8xl xl:text-[9.5rem]";
  // Medium names - Balanced
  if (len <= 22) return "text-3xl md:text-6xl lg:text-7xl xl:text-8xl";
  // Long names - Safe scaling
  if (len <= 35) return "text-2xl md:text-5xl lg:text-6xl xl:text-7xl";
  // Very long names
  return "text-xl md:text-4xl lg:text-5xl xl:text-6xl";
};

import { Gift, Activity, Flame, Star, PartyPopper } from "lucide-react";
import { THEME_COLORS } from "../constants";

export const getTheme = (type, mainName) => {
  const iconSize = 60;
  const commonClasses = "w-8 h-8 md:w-[60px] md:h-[60px]";

  switch (type) {
    case "birthday":
      return {
        icon: <Gift size={iconSize} className={commonClasses} />,
        color: THEME_COLORS.BIRTHDAY,
      };
    case "healing":
      return {
        icon: <Activity size={iconSize} className={commonClasses} />,
        color: THEME_COLORS.HEALING,
      };
    case "success":
      return {
        icon: <Star size={iconSize} className={commonClasses} />,
        color: THEME_COLORS.SUCCESS || "text-blue-600",
      };
    case "holiday":
      if (mainName && mainName.includes("פורים")) {
        return {
          icon: <PartyPopper size={iconSize} className={commonClasses} />,
          color: "text-purple-600",
        };
      }
      return {
        icon: <Star size={iconSize} className={commonClasses} />,
        color: "text-orange-500",
      };
    default: // memorial
      return {
        icon: <Flame size={iconSize} className={commonClasses} />,
        color: "text-amber-600",
      };
  }
};
