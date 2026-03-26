import React from "react";
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
<<<<<<< HEAD
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
=======
      className={`theme-toggle inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
>>>>>>> e72ab60ed14f9f5601b4c828ecb92357e3230a1b
    >
      {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;