import { redirect } from "next/navigation";

/**
 * صفحة /dashboard/admin نفسها مالهاش محتوى مستقل — أول ما حد يزورها
 * بيتحول تلقائي لقسم "الدروس" (الافتراضي). التابس والـ breadcrumb بتوع
 * الإدارة موجودين في layout.tsx بتاع نفس الفولدر ده، فمفيش داعي نكررهم هنا.
 */
export default function AdminIndexPage() {
  redirect("/dashboard/admin/skills");
}
