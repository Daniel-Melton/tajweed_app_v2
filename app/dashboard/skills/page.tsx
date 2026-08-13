import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProgress } from "@/lib/actions";

export default async function SkillsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  const progress = await getUserProgress(session.user.id);

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
          <h1 className="text-lg md:text-xl font-extrabold text-emerald-950 dark:text-white">فهرس الدروس</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {skills.length === 0 ? (
          <div className="text-center py-20 text-emerald-700/60 dark:text-gray-500">لا توجد أحكام مضافة حاليًا.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, i) => {
              const isCompleted = !!progress.find((p) => p.skillId === skill.id)?.isCompleted;
              const prevCompleted =
                i === 0 || !!progress.find((p) => p.skillId === skills[i - 1].id)?.isCompleted;
              const isLocked = !prevCompleted;

              const cardContent = (
                <div
                  className={`h-full p-5 rounded-2xl border transition-colors ${
                    isLocked
                      ? "bg-emerald-50/60 dark:bg-gray-900/50 border-emerald-100 dark:border-gray-800 opacity-60"
                      : "bg-white dark:bg-gray-900 border-emerald-100 dark:border-gray-800 hover:border-emerald-400 dark:hover:border-emerald-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold ${
                        isLocked
                          ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-emerald-800 ring-1 ring-emerald-200"
                      }`}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </span>
                    {isLocked && <span className="text-xs text-emerald-700/50 dark:text-gray-500">🔒 مقفول</span>}
                  </div>
                  <h2 className="text-lg font-bold text-emerald-950 dark:text-white mb-1">{skill.title}</h2>
                  <p className="text-emerald-700/70 dark:text-gray-400 text-sm line-clamp-2">{skill.concept}</p>
                </div>
              );

              return isLocked ? (
                <div key={skill.id}>{cardContent}</div>
              ) : (
                <Link key={skill.id} href={`/dashboard/skills/${skill.slug}`}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
