"use client";

import { useTransition, useState } from "react";
import { markSkillAsCompleted } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface CompleteButtonProps {
  skillId: string;
  userId: string;
  initialCompleted: boolean;
  /** لو true الزرار بيفضل معطّل حتى لو كل حاجة تانية جاهزة (مثلاً: لسه ما خلصش التمارين) */
  disabledUntilPractice?: boolean;
  /** الوجهة بعد الإتمام — الدرس التالي لو موجود، أو رحلة الشجرة لو ده آخر درس */
  nextHref?: string;
  /** نتيجة التمارين (لو الدرس فيه تمارين) عشان نحدد نوع رسالة التهنئة */
  practiceScore?: { score: number; total: number } | null;
}

export default function CompleteButton({
  skillId,
  userId,
  initialCompleted,
  disabledUntilPractice = false,
  nextHref = "/dashboard",
  practiceScore = null,
}: CompleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleComplete = () => {
    startTransition(async () => {
      await markSkillAsCompleted(skillId, userId);
      setIsCompleted(true);

      if (practiceScore) {
        const pct = Math.round((practiceScore.score / practiceScore.total) * 100);
        setMessage(
          pct >= 60
            ? "🎉 أحسنت! أتممت الدرس بنجاح وإتقان."
            : "تم إتمام الدرس. يُستحسن مراجعة الحكم والتمارين مرة أخرى لإتقانه أكتر."
        );
      } else {
        setMessage("🎉 تم إتمام الدرس بنجاح!");
      }

      setTimeout(() => router.push(nextHref), 1600);
    });
  };

  const isDisabled = isPending || isCompleted || disabledUntilPractice;

  return (
    <div>
      {disabledUntilPractice && !isCompleted && (
        <p className="text-center text-sm text-emerald-700/60 dark:text-gray-500 mb-2">
          أكمل التمارين التفاعلية فوق عشان تقدر تنهي الدرس
        </p>
      )}
      {message && (
        <p className="text-center text-emerald-600 dark:text-emerald-400 font-bold mb-2">{message}</p>
      )}
      <button
        onClick={handleComplete}
        disabled={isDisabled}
        className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg text-lg ${
          isCompleted
            ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-100 cursor-not-allowed"
            : disabledUntilPractice
              ? "bg-emerald-100 dark:bg-gray-800 text-emerald-700/50 dark:text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
        }`}
      >
        {isPending
          ? "جاري الحفظ..."
          : isCompleted
            ? "تم إتمام الدرس ✅"
            : "إتمام الدرس والانتقال للتالي ←"}
      </button>
    </div>
  );
}
