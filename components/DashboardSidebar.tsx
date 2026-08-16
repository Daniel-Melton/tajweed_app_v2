"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  {
    label: "الرئيسية",
    href: "/dashboard",
    exact: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5" />
      </svg>
    ),
  },
  {
    label: "التحليلات",
    href: "/dashboard/analytics",
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M8 17v-5m5 5V8m5 9v-8" />
      </svg>
    ),
  },
  {
    label: "الدورات",
    href: "/dashboard/skills",
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.2c-1.8-1.5-4.4-1.8-7-1.6v13.4c2.6-.2 5.2.1 7 1.6 1.8-1.5 4.4-1.8 7-1.6V4.6c-2.6-.2-5.2.1-7 1.6zM12 6.2v13.4" />
      </svg>
    ),
  },
  {
    label: "الإعدادات",
    href: "/dashboard/settings",
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.5 1z" />
      </svg>
    ),
  },
];

const adminNavItem = {
  label: "لوحة الإدارة",
  href: "/dashboard/admin",
  exact: false,
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L14.5 10" />
    </svg>
  ),
};

/**
 * الشريط الجانبي المشترك لكل شاشات /dashboard/* — بما فيها شاشات الأدمن.
 * بيتحط مرة واحدة في app/dashboard/layout.tsx فيفضل ظاهر في كل الصفحات
 * تلقائيًا من غير ما نكرره في كل page.tsx. isAdmin بييجي من السيرفر
 * (الـ layout) كـ prop عشان الملف ده يفضل client component يقدر يستخدم
 * usePathname لتحديد ومعرفة الأيقونة النشطة فعليًا.
 */
export default function DashboardSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const allNavItems = isAdmin ? [...navItems, adminNavItem] : navItems;

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 md:w-20 bg-white/95 dark:bg-gray-900/95 border-r border-emerald-100 dark:border-gray-800 z-50 flex flex-col items-center py-6 gap-8 transition-colors">
      <Link href="/dashboard" className="text-2xl md:text-3xl select-none" title="رحلة إتقان التجويد">
        🌿
      </Link>
      <nav className="flex flex-col gap-6 md:gap-8">
        {allNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            title={item.label}
            className={`p-1 transition-colors ${
              isActive(item.href, item.exact)
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-emerald-700/60 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-4">
        <ThemeToggle />
        <LogoutButton variant="icon" />
      </div>
    </aside>
  );
}
