import React from "react";
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        flex items-center justify-center
        h-10 w-10 rounded-full
        bg-white/10 dark:bg-white/5
        backdrop-blur-md
        border border-white/20
        text-slate-700 dark:text-white
        hover:scale-110 hover:rotate-12
        transition duration-300
      "
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;