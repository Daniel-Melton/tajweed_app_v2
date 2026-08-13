import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const totalLessons = await prisma.skill.count();
  const completedCount = await prisma.userProgress.count({
    where: { userId: session.user.id, isCompleted: true },
  });
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const results = await prisma.testResult.findMany({
    where: { userId: session.user.id },
    orderBy: { id: "desc" },
    take: 10,
  });

  const allResults = await prisma.testResult.findMany({
    where: { userId: session.user.id },
  });
  const avgScorePct =
    allResults.length > 0
      ? Math.round(
          (allResults.reduce((sum, r) => sum + r.score / r.totalQuestions, 0) / allResults.length) * 100
        )
      : null;
  const passedCount = allResults.filter((r) => r.isPassed).length;

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-950 text-emerald-950 dark:text-white transition-colors" dir="rtl">
      <header className="border-b border-emerald-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur sticky top-0 z-10 transition-colors">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-800 flex items-center justify-center text-emerald-700 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-white hover:border-emerald-600 transition-colors"
            aria-label="العودة لرحلة الشجرة"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
          <h1 className="text-lg md:text-xl font-extrabold text-emerald-950 dark:text-white">التحليلات</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* بطاقات ملخّص */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-5 transition-colors">
            <p className="text-emerald-700/60 dark:text-gray-500 text-xs mb-1">نسبة إنجاز المنهج</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{progressPct}%</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-5 transition-colors">
            <p className="text-emerald-700/60 dark:text-gray-500 text-xs mb-1">دروس مكتملة</p>
            <p className="text-2xl font-extrabold text-emerald-950 dark:text-white">
              {completedCount}<span className="text-emerald-700/50 dark:text-gray-500 text-base"> / {totalLessons}</span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-5 transition-colors">
            <p className="text-emerald-700/60 dark:text-gray-500 text-xs mb-1">متوسط نتائج التمارين</p>
            <p className="text-2xl font-extrabold text-emerald-950 dark:text-white">
              {avgScorePct !== null ? `${avgScorePct}%` : "—"}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-5 transition-colors">
            <p className="text-emerald-700/60 dark:text-gray-500 text-xs mb-1">تمارين ناجحة (≥60%)</p>
            <p className="text-2xl font-extrabold text-emerald-950 dark:text-white">
              {passedCount}<span className="text-emerald-700/50 dark:text-gray-500 text-base"> / {allResults.length}</span>
            </p>
          </div>
        </div>

        {/* شريط تقدم عام */}
        <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-5 transition-colors">
          <div className="flex justify-between text-sm text-emerald-700/70 dark:text-gray-400 mb-2">
            <span>تقدمك في رحلة إتقان التجويد</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2.5 bg-emerald-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* آخر محاولات التمارين */}
        <div>
          <h2 className="text-lg font-bold text-emerald-950 dark:text-white mb-3">آخر محاولات التمارين</h2>
          {results.length === 0 ? (
            <p className="text-emerald-700/60 dark:text-gray-500 text-sm">لسه معملتش أي تمرين. ابدأ درس وجرّب!</p>
          ) : (
            <div className="space-y-2">
              {results.map((r) => {
                const pct = Math.round((r.score / r.totalQuestions) * 100);
                return (
                  <div
                    key={r.id}
                    className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between transition-colors"
                  >
                    <span className="text-emerald-950 dark:text-white font-semibold">{r.skillTitle}</span>
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${
                        r.isPassed
                          ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {r.score}/{r.totalQuestions} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
