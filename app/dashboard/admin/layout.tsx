"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const adminTabs = [
  { label: "الدروس", href: "/dashboard/admin/skills" },
  { label: "الأمثلة القرآنية", href: "/dashboard/admin/quran-examples" },
  { label: "أسئلة التمارين", href: "/dashboard/admin/questions" },
];

/** تسميات عربية لأجزاء الرابط عشان نبني breadcrumb مفهوم بدل الأكواد التقنية */
const segmentLabels: Record<string, string> = {
  skills: "الدروس",
  new: "إضافة درس جديد",
  edit: "تعديل الدرس",
  questions: "أسئلة التمارين",
  "quran-examples": "الأمثلة القرآنية",
};

/** لو الجزء ده معرّف (id) عشوائي (زي cuid/uuid) نتجاهله من الـ breadcrumb لأنه مش مفيد للعرض */
function isLikelyId(segment: string) {
  return segment.length > 15 || /^[a-z0-9]{20,}$/i.test(segment);
}

function useBreadcrumbs() {
  const pathname = usePathname();
  // من شكل: /dashboard/admin/skills/xxxx/edit
  const parts = pathname.split("/").filter(Boolean); // ["dashboard","admin","skills","xxxx","edit"]
  const adminIndex = parts.indexOf("admin");
  if (adminIndex === -1) return [];

  const afterAdmin = parts.slice(adminIndex + 1); // ["skills","xxxx","edit"]
  const crumbs: { label: string; href: string }[] = [{ label: "لوحة الإدارة", href: "/dashboard/admin/skills" }];

  let hrefAcc = "/dashboard/admin";
  for (const seg of afterAdmin) {
    hrefAcc += `/${seg}`;
    if (isLikelyId(seg)) continue; // مش هنعرض الـ id الخام
    const label = segmentLabels[seg] ?? seg;
    crumbs.push({ label, href: hrefAcc });
  }
  return crumbs;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const crumbs = useBreadcrumbs();

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-emerald-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* الصف الأول: breadcrumb + المستخدم الحالي */}
          <div className="flex items-center justify-between gap-4 py-3 border-b border-emerald-50 dark:border-gray-900">
            <nav className="flex items-center gap-1.5 text-sm text-emerald-700/80 dark:text-gray-400 overflow-x-auto">
              {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                  <span key={crumb.href} className="flex items-center gap-1.5 whitespace-nowrap">
                    {i > 0 && <span className="text-emerald-300 dark:text-gray-700">/</span>}
                    {isLast ? (
                      <span className="font-bold text-emerald-900 dark:text-white">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>

            {session?.user && (
              <div className="flex items-center gap-2 shrink-0 text-sm">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {(session.user.name ?? session.user.email ?? "أ").charAt(0)}
                </div>
                <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">
                  {session.user.name ?? session.user.email}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  أدمن
                </span>
              </div>
            )}
          </div>

          {/* الصف الثاني: تبويبات التنقل بين أقسام الإدارة */}
          <div className="flex items-center gap-2 py-3">
            {adminTabs.map((tab) => {
              const active = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "text-emerald-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
