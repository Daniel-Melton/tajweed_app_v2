"use client";

import { useTheme } from "@/components/ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
      aria-label={theme === "dark" ? "التبديل للوضع النهاري" : "التبديل للوضع الليلي"}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 border border-emerald-200 dark:border-gray-800 ${className}`}
    >
      {theme === "dark" ? (
        // أيقونة شمس (الضغط عليها يودّي للوضع النهاري)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // أيقونة قمر (الضغط عليها يودّي للوضع الليلي)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
