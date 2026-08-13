import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import LessonHeader from "@/components/LessonHeader";
import QuranExampleCard from "@/components/QuranExampleCard";
import LessonCompletionFlow from "@/components/LessonCompletionFlow";
import Link from "next/link";

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  
  // جلب الدرس + أمثلته القرآنية + أسئلة التمارين
  const skill = await prisma.skill.findUnique({
    where: { slug: slug },
    include: {
      quranExamples: { orderBy: { order: "asc" } },
      questions: true,
    },
  });

  // التحقق من وجود الدرس وجلسة المستخدم
  if (!skill || !session?.user?.id) notFound();

  // @ts-ignore role مضافة يدويًا في next-auth callbacks
  const isAdmin = session.user.role === "ADMIN";

  // "السحر هنا": التحقق من قاعدة البيانات لمعرفة هل المستخدم أكمل هذا الدرس مسبقاً
  const progress = await prisma.userProgress.findUnique({
    where: {
      userId_skillId: {
        userId: session.user.id,
        skillId: skill.id,
      },
    },
  });

  // بيانات الهيدر: ترتيب الدرس ضمن المنهج + التقدم العام
  const totalLessons = await prisma.skill.count();
  const lessonsBefore = await prisma.skill.count({ where: { order: { lt: skill.order } } });
  const lessonNumber = lessonsBefore + 1;
  const completedCount = await prisma.userProgress.count({
    where: { userId: session.user.id, isCompleted: true },
  });

  // الدرس التالي في الترتيب (لو موجود) عشان ننتقل له بعد الإتمام
  const nextSkill = await prisma.skill.findFirst({
    where: { order: { gt: skill.order } },
    orderBy: { order: "asc" },
    select: { slug: true },
  });
  const nextHref = nextSkill ? `/dashboard/skills/${nextSkill.slug}` : "/dashboard";

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-950 text-emerald-950 dark:text-white transition-colors" dir="rtl">
      <LessonHeader
        title={skill.title}
        lessonNumber={lessonNumber}
        totalLessons={totalLessons}
        completedCount={completedCount}
      />

      <div className="max-w-4xl mx-auto p-8 pt-28 md:pt-32">
        {skill.videoUrl && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-8 border border-emerald-100 dark:border-gray-800">
            <iframe 
              className="w-full h-full" 
              src={skill.videoUrl.replace("watch?v=", "embed/")} 
              title={skill.title} 
              allowFullScreen 
            />
          </div>
        )}

        {/* شرح الحكم */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl mt-8 shadow-lg border border-emerald-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm">
              📖
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-400">تعريف الحكم</h2>
          </div>
          <div className="text-emerald-900 dark:text-gray-300 leading-relaxed text-lg">{skill.concept}</div>
        </div>

        {skill.quranExamples.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm">
                  ✨
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  أمثلة من القرآن الكريم
                </h2>
              </div>
              {isAdmin && (
                <Link
                  href={`/dashboard/admin/quran-examples?skillId=${skill.id}`}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-800 text-emerald-700 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-white hover:border-emerald-600 transition-colors"
                >
                  ✏️ إدارة أمثلة هذا الدرس
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {skill.quranExamples.map((example) => (
                <QuranExampleCard
                  key={example.id}
                  surahName={example.surahName}
                  surahNumber={example.surahNumber}
                  ayahNumber={example.ayahNumber}
                  verseText={example.verseText}
                  highlights={example.highlights}
                  audioHusaryPath={example.audioHusaryPath}
                  audioMinshawiPath={example.audioMinshawiPath}
                />
              ))}
            </div>
          </div>
        )}

        {isAdmin && skill.quranExamples.length === 0 && (
          <div className="mt-8">
            <Link
              href={`/dashboard/admin/quran-examples?skillId=${skill.id}`}
              className="inline-block text-sm px-4 py-2 rounded-lg bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-800 text-emerald-700 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-white hover:border-emerald-600 transition-colors"
            >
              ✏️ إضافة أمثلة قرآنية لهذا الدرس
            </Link>
          </div>
        )}

        <LessonCompletionFlow
          skillId={skill.id}
          skillSlug={skill.slug}
          skillTitle={skill.title}
          userId={session.user.id}
          initialCompleted={!!progress?.isCompleted}
          nextHref={nextHref}
          isAdmin={isAdmin}
          manageQuestionsHref={`/dashboard/admin/questions?skillId=${skill.id}`}
          questions={skill.questions.map((q) => ({
            id: q.id,
            questionText: q.questionText || q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))}
        />
      </div>
    </div>
  );
}