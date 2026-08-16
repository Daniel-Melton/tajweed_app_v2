import Link from "next/link";
import { getAllSkillsForAdmin } from "@/lib/actions";
import DeleteSkillButton from "@/components/admin/DeleteSkillButton";

export default async function AdminSkillsPage() {
  const skills = await getAllSkillsForAdmin();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">إدارة الدروس</h1>
          <Link
            href="/dashboard/admin/skills/new"
            className="px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            + إضافة درس جديد
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400 dark:text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4">الترتيب</th>
                <th className="p-4">العنوان</th>
                <th className="p-4">أمثلة قرآنية</th>
                <th className="p-4">أسئلة</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-gray-500 dark:text-gray-400 dark:text-gray-600 dark:text-gray-300">{skill.order}</td>
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{skill.title}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 dark:text-gray-600 dark:text-gray-300">{skill._count.quranExamples}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 dark:text-gray-600 dark:text-gray-300">{skill._count.questions}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/admin/skills/${skill.id}/edit`}
                        className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-100 transition"
                      >
                        تعديل
                      </Link>
                      <DeleteSkillButton skillId={skill.id} skillTitle={skill.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {skills.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 dark:text-gray-600 dark:text-gray-300">
                    لا يوجد دروس بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
