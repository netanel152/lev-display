import { Gift, Activity, Flame, Star, PartyPopper } from "lucide-react";
import { THEME_COLORS } from "../constants";

export const getFontSize = (text) => {
  if (!text) return "text-4xl md:text-8xl lg:text-[10rem]";
  const len = text.length;
  if (len < 10) return "text-4xl md:text-8xl lg:text-[10rem]";
  if (len <= 20) return "text-3xl md:text-7xl lg:text-8xl";
  return "text-2xl md:text-5xl lg:text-6xl";
};

export const getTheme = (type, mainName) => {
  const iconSize = 70;
  const commonClasses = "w-10 h-10 md:w-[70px] md:h-[70px]";

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
        color: THEME_COLORS.MEMORIAL,
      };
  }
};