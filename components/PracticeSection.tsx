"use client";

import { useEffect, useState } from "react";

interface PracticeQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  questions: PracticeQuestion[];
  /** بيتنادى مرة واحدة لما الطالب يوصل لشاشة النتيجة النهائية */
  onFinish?: (score: number, total: number) => void;
}

export default function PracticeSection({ questions, onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) onFinish?.(score, questions.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  function selectAnswer(option: string) {
    if (selected) return; // مفيش تغيير الاختيار بعد ما يجاوب
    setSelected(option);
    if (option === current.correctAnswer) setScore((s) => s + 1);
  }

  function goNext() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-8 text-center transition-colors">
        <div className="text-4xl mb-3">{pct >= 70 ? "🎉" : "💪"}</div>
        <h3 className="text-xl font-bold text-emerald-950 dark:text-white mb-1">
          نتيجتك: {score} من {questions.length}
        </h3>
        <p className="text-emerald-700/70 dark:text-gray-400 mb-6">
          {pct >= 70 ? "أحسنت! أتقنت هذا الحكم." : "راجع الحكم تاني وحاول مرة أخرى."}
        </p>
        <button
          type="button"
          onClick={restart}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-6 md:p-8 transition-colors">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-emerald-700/60 dark:text-gray-500 font-bold">
          سؤال {currentIndex + 1} من {questions.length}
        </span>
        <div className="w-32 h-1.5 bg-emerald-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${((currentIndex + (selected ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-lg md:text-xl font-bold text-emerald-950 dark:text-white mb-6" dir="rtl">
        {current.questionText}
      </p>

      <div className="space-y-3">
        {current.options.map((option) => {
          const isSelected = selected === option;
          const isRightAnswer = option === current.correctAnswer;

          let stateClasses =
            "border-emerald-100 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-gray-700 text-emerald-900 dark:text-gray-200";
          if (selected) {
            if (isRightAnswer) {
              stateClasses =
                "border-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
            } else if (isSelected) {
              stateClasses =
                "border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400";
            } else {
              stateClasses = "border-emerald-100 dark:border-gray-800 text-emerald-900/40 dark:text-gray-500";
            }
          }

          return (
            <button
              key={option}
              type="button"
              onClick={() => selectAnswer(option)}
              disabled={!!selected}
              dir="rtl"
              className={`w-full text-right p-4 rounded-xl border-2 font-semibold transition-colors ${stateClasses}`}
            >
              {option}
              {selected && isRightAnswer && " ✓"}
              {selected && isSelected && !isRightAnswer && " ✗"}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          type="button"
          onClick={goNext}
          className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
        >
          {isLast ? "عرض النتيجة" : "السؤال التالي"}
        </button>
      )}
    </div>
  );
}
