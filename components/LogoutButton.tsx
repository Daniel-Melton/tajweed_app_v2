"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  /** icon = دائرة أيقونة بس (للشريط الجانبي)، full = زرار كامل بنص */
  variant?: "icon" | "full";
  className?: string;
}

export default function LogoutButton({ variant = "full", className = "" }: LogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        title="تسجيل الخروج"
        aria-label="تسجيل الخروج"
        className={`text-emerald-700/60 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 ${className}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H8.25m9.75 0l-3-3m3 3l-3 3"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-950/50 border border-emerald-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-900 text-emerald-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-bold text-sm transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H8.25m9.75 0l-3-3m3 3l-3 3"
        />
      </svg>
      تسجيل الخروج
    </button>
  );
}
