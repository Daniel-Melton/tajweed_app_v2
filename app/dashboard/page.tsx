import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProgress } from "@/lib/actions";
import Link from "next/link";
import { getLessonPositions, getTileCount, TREE_ASPECT } from "@/lib/lessonTreeLayout";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="text-white text-center mt-20 text-lg">الرجاء تسجيل الدخول</div>;
  }

  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  const progress = await getUserProgress(session.user.id);

  const completedCount = progress.filter((p) => p.isCompleted).length;
  const total = skills.length;
  const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const positions = getLessonPositions(total);
  const tiles = getTileCount(total);

  return (
    <div className="text-emerald-950 dark:text-white">
      {/* الهيدر ثابت (position:fixed) فبيتجاهل padding أي حاوية أب — لازم يحط padding على نفسه دايمًا بغض النظر عن layout.tsx */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-emerald-100 dark:border-gray-800 pl-16 md:pl-20 transition-colors">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-extrabold text-emerald-950 dark:text-white truncate">رحلة إتقان التجويد</h1>
            <p className="text-[11px] md:text-sm text-emerald-700/70 dark:text-gray-400 mt-1 truncate">
              أكاديمية تعلم أحكام التلاوة والتجويد أونلاين
            </p>
          </div>
          <div className="w-36 md:w-64 shrink-0">
            <div className="flex justify-between text-[10px] md:text-xs text-emerald-700/70 dark:text-gray-400 mb-1.5">
              <span>تقدمك</span>
              <span>
                {completedCount}/{total} دروس
              </span>
            </div>
            <div className="h-2 bg-emerald-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى — الـ pl هنا اتشالت لأن layout.tsx الأب بقى بيحطها تلقائي (main مش fixed) */}
      <main className="pt-24 md:pt-28 pb-12">
        <div className="relative max-w-4xl mx-auto px-4 md:px-8">
          {total === 0 ? (
            <div className="text-center py-24">
              <p className="text-emerald-700/70 dark:text-gray-400 text-lg">لا توجد أحكام مضافة حالياً.</p>
              <p className="text-emerald-700/50 dark:text-gray-500 text-sm mt-2">سيتم إضافة الأحكام قريباً بمشيئة الله</p>
            </div>
          ) : (
            <div className="relative mt-14 md:mt-20 mb-6">
              {/* الساق (يتكرر رأسيًا بعدد النسخ اللازمة لاستيعاب كل الدروس) */}
              <div
                aria-hidden="true"
                className="w-full"
                style={{
                  aspectRatio: `${TREE_ASPECT} / ${tiles}`,
                  backgroundImage: "url('/images/treev2.png')",
                  backgroundSize: "100% auto",
                  backgroundPosition: "top center",
                  backgroundRepeat: "repeat-y",
                }}
              />

              {/* أوراق الدروس على طول الساق */}
              {positions.map((pos, i) => {
                const skill = skills[i];
                if (!skill) return null;
                const isCompleted = progress.find((p) => p.skillId === skill.id)?.isCompleted;
                const prevCompleted =
                  i === 0 ||
                  !!progress.find((p) => p.skillId === skills[i - 1].id)?.isCompleted;
                const isLocked = !prevCompleted;
                const isCurrent = !isLocked && !isCompleted;

                const cardInner = (
                  <div
                    className={`leaf-card relative ${
                      isLocked ? "locked" : ""
                    } ${isCurrent ? "animate-soft-pulse" : ""}`}
                  >
                    {/* رسمة الورقة (تنعكس أفقيًا للأوراق على يسار الساق) */}
                    <div className={`leaf-card__art ${pos.flip ? "leaf-card__art--flip" : ""}`} />

                    {/* شارة الرقم (أو علامة الصح لو الدرس مكتمل) */}
                    <div
                      className={`absolute -top-1 left-[42%] -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-extrabold shadow-lg ring-2 ring-black/30 z-20 ${
                        isLocked
                          ? "bg-gray-700 text-gray-200"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-emerald-800"
                      }`}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </div>

                    {/* اسم الدرس فقط */}
                    <div className="flex items-center justify-center text-center px-3 h-full w-full relative z-[5]">
                      <h2 className="text-white font-bold text-[9px] md:text-[11px] leading-tight drop-shadow-md line-clamp-2">
                        {skill.title}
                      </h2>
                    </div>
                  </div>
                );

                const style = {
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
                } as const;

                if (isLocked) {
                  return (
                    <div key={skill.id} className="absolute z-10" style={style}>
                      {cardInner}
                    </div>
                  );
                }

                return (
                  <Link key={skill.id} href={`/dashboard/skills/${skill.slug}`} className="absolute z-10 block" style={style}>
                    {cardInner}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
