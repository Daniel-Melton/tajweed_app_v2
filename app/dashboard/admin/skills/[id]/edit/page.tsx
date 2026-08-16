import { getSkillForAdmin } from "@/lib/actions";
import SkillForm from "@/components/admin/SkillForm";
import QuranExamplesManager from "@/components/admin/QuranExamplesManager";
import QuestionsManager from "@/components/admin/QuestionsManager";

export default async function EditSkillPage({ params }: { params: { id: string } }) {
  const skill = await getSkillForAdmin(params.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-300 mb-8">تعديل: {skill.title}</h1>
          <SkillForm mode="edit" skill={skill} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-6">الأمثلة القرآنية</h2>
          <QuranExamplesManager skillId={skill.id} examples={skill.quranExamples} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-6">أسئلة التمارين</h2>
          <QuestionsManager skillId={skill.id} questions={skill.questions} />
        </div>
      </div>
    </div>
  );
}
