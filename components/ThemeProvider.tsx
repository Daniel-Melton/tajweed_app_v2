"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // القيمة الابتدائية "light" (المطابقة للسكربت اللي بيحط الكلاس قبل الرسم)،
  // وبعدين بنزامنها مع اللي فعليًا محفوظ في localStorage بعد أول render.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme لازم يتستخدم جوه ThemeProvider");
  return ctx;
}
