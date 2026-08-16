import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore role مضافة يدويًا في next-auth callbacks
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-950 transition-colors" dir="rtl">
      <DashboardSidebar isAdmin={isAdmin} />
      {/*
        الـ padding هنا هو المصدر الوحيد لإبعاد المحتوى عن السايدبار الثابت
        (fixed) لكل صفحات /dashboard/* . أي صفحة تانية (analytics, settings,
        admin/*, إلخ) معندهاش داعي تحط padding خاص بيها تاني — غير عناصر
        الـ position:fixed زي الهيدر في dashboard/page.tsx، لأن الـ fixed
        بتتجاهل padding أي حاوية أب وبتحتاج تحط padding على نفسها مباشرة.
      */}
      <div className="pl-16 md:pl-20">{children}</div>
    </div>
  );
}
