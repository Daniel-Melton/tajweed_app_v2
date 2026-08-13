import Link from "next/link";

interface LessonHeaderProps {
  /** عنوان الدرس الحالي */
  title: string;
  /** ترتيب الدرس الحالي ضمن المنهج (1-based) */
  lessonNumber: number;
  /** إجمالي عدد دروس المنهج */
  totalLessons: number;
  /** عدد الدروس اللي المستخدم خلّصها (على مستوى المنهج كله، مش الدرس ده بس) */
  completedCount: number;
}

/**
 * هيدر شاشة الدرس من الداخل: زرار رجوع لرحلة الشجرة + عنوان الدرس +
 * شريط تقدم عام على مستوى المنهج (نفس أسلوب هيدر لوحة الشجرة للتناسق البصري).
 */
export default function LessonHeader({
  title,
  lessonNumber,
  totalLessons,
  completedCount,
}: LessonHeaderProps) {
  const progressPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-emerald-100 dark:border-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3 md:gap-6">
        {/* زرار الرجوع لرحلة الشجرة */}
        <Link
          href="/dashboard"
          aria-label="العودة لرحلة التعلم"
          className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-800 flex items-center justify-center text-emerald-700 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-white hover:border-emerald-600 hover:bg-emerald-100 dark:hover:bg-gray-800 transition-colors"
        >
          {/* سهم للخلف (يمين لأن الاتجاه RTL) */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>

        {/* عنوان الدرس + رقمه */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] md:text-xs text-emerald-600 dark:text-emerald-500 font-bold mb-0.5">
            الدرس {lessonNumber} من {totalLessons}
          </p>
          <h1 className="text-base md:text-xl font-extrabold text-emerald-950 dark:text-white truncate">
            {title}
          </h1>
        </div>

        {/* شريط التقدم العام على مستوى المنهج */}
        <div className="w-20 sm:w-32 md:w-56 shrink-0">
          <div className="flex justify-between text-[10px] md:text-xs text-emerald-700/70 dark:text-gray-400 mb-1.5">
            <span>تقدمك</span>
            <span>
              {completedCount}/{totalLessons}
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
  );
}
