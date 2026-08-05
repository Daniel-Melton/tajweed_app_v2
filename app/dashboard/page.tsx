import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProgress } from "@/lib/actions";
import Link from "next/link";
import { getLessonPositions } from "@/lib/lessonTreeLayout";

const navItems = [
  {
    label: "الرئيسية",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5" />
      </svg>
    ),
  },
  {
    label: "التحليلات",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M8 17v-5m5 5V8m5 9v-8" />
      </svg>
    ),
  },
  {
    label: "الدورات",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.2c-1.8-1.5-4.4-1.8-7-1.6v13.4c2.6-.2 5.2.1 7 1.6 1.8-1.5 4.4-1.8 7-1.6V4.6c-2.6-.2-5.2.1-7 1.6zM12 6.2v13.4" />
      </svg>
    ),
  },
  {
    label: "الإعدادات",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.5 1z" />
      </svg>
    ),
  },
];

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

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      {/* الشريط الجانبي الأيسر */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 md:w-20 bg-gray-900/95 border-r border-gray-800 z-50 flex flex-col items-center py-6 gap-8">
        <div className="text-2xl md:text-3xl select-none" title="رحلة إتقان التجويد">🌿</div>
        <nav className="flex flex-col gap-6 md:gap-8">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              title={item.label}
              className={`text-gray-400 hover:text-emerald-400 transition-colors p-1 ${
                i === 0 ? "text-emerald-400" : ""
              }`}
            >
              {item.icon}
            </button>
          ))}
        </nav>
      </aside>

      {/* الهيدر الثابت */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800 pl-16 md:pl-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-extrabold text-white truncate">رحلة إتقان التجويد</h1>
            <p className="text-[11px] md:text-sm text-gray-400 mt-1 truncate">
              أكاديمية تعلم أحكام التلاوة والتجويد أونلاين
            </p>
          </div>
          <div className="w-36 md:w-64 shrink-0">
            <div className="flex justify-between text-[10px] md:text-xs text-gray-400 mb-1.5">
              <span>تقدمك</span>
              <span>
                {completedCount}/{total} دروس
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى */}
      <main className="pt-24 md:pt-28 pl-16 md:pl-20 pb-12 overflow-x-auto">
        <div className="relative min-w-[760px] max-w-6xl mx-auto px-4 md:px-8">
          {total === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">لا توجد أحكام مضافة حالياً.</p>
              <p className="text-gray-500 text-sm mt-2">سيتم إضافة الأحكام قريباً بمشيئة الله</p>
            </div>
          ) : (
            <div className="relative">
              {/* الشجرة (صورة خلفية واحدة) */}
              <div
                aria-hidden="true"
                className="w-full"
                style={{
                  aspectRatio: "921 / 683",
                  backgroundImage: "url('/images/treev2.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />

              {/* أوراق الدروس على أطراف الفروع */}
              {positions.map((pos, i) => {
                const skill = skills[i];
                if (!skill) return null;
                const isCompleted = progress.find((p) => p.skillId === skill.id)?.isCompleted;
                const prevCompleted =
                  i === 0 ||
                  !!progress.find((p) => p.skillId === skills[i - 1].id)?.isCompleted;
                const isLocked = !prevCompleted;
                const isCurrent = !isLocked && !isCompleted;

                return (
                  <div
                    key={skill.id}
                    className="absolute z-10"
                    style={{
                      left: `${pos.left}%`,
                      top: `${pos.top}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
                    }}
                  >
                    <div
                      className={`leaf-card relative ${
                        isLocked ? "locked" : ""
                      } ${isCurrent ? "animate-soft-pulse" : ""}`}
                    >
                      {/* شارة الرقم أعلى الورقة */}
                      <div
                        className={`absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[11px] md:text-xs font-extrabold shadow-lg ring-2 ring-black/20 z-20 ${
                          isLocked
                            ? "bg-gray-800 text-gray-400"
                            : isCompleted
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-emerald-800"
                        }`}
                      >
                        {i + 1}
                      </div>

                      {/* محتوى الورقة */}
                      <div className="flex flex-col items-center justify-center text-center px-2.5 py-2 h-full w-full relative z-[5]">
                        <h2 className="text-white font-bold text-[11px] md:text-sm leading-tight drop-shadow-md px-1">
                          {skill.title}
                        </h2>

                        {/* زر الحالة أسفل الورقة */}
                        <div className="mt-1.5">
                          {isCurrent && (
                            <Link
                              href={`/dashboard/skills/${skill.slug}`}
                              className="inline-block px-2.5 py-1 bg-emerald-600 text-white text-[10px] md:text-[11px] font-bold rounded-full hover:bg-emerald-500 transition-all hover:scale-105"
                            >
                              ابدأ الآن
                            </Link>
                          )}

                          {isLocked && (
                            <span className="inline-block px-2.5 py-1 bg-black/30 text-gray-300 text-[10px] md:text-[11px] font-bold rounded-full">
                              🔒 مغلق
                            </span>
                          )}

                          {isCompleted && (
                            <span className="inline-block px-2.5 py-1 bg-emerald-900/50 text-emerald-100 text-[10px] md:text-[11px] font-bold rounded-full">
                              ✓ تم الإنجاز
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
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
