import SkillForm from "@/components/admin/SkillForm";

export default function NewSkillPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-300 mb-8">إضافة درس جديد</h1>
        <SkillForm mode="create" />
      </div>
    </div>
  );
}
