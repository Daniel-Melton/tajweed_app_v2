"use client";

import { useTransition, useState } from "react";
import { markSkillAsCompleted } from "@/lib/actions";
import { useRouter } from "next/navigation";

// أضفنا initialCompleted لاستقبال الحالة من السيرفر
export default function CompleteButton({ 
  skillId, 
  userId, 
  initialCompleted 
}: { 
  skillId: string, 
  userId: string, 
  initialCompleted: boolean 
}) {
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(initialCompleted); // نستخدم الحالة الأولية
  const router = useRouter();

  const handleComplete = () => {
    startTransition(async () => {
      await markSkillAsCompleted(skillId, userId);
      setIsCompleted(true);
      setTimeout(() => router.push("/dashboard"), 1000);
    });
  };

  return (
    <button
      onClick={handleComplete}
      disabled={isPending || isCompleted}
      className={`mt-4 w-full font-bold py-4 rounded-xl transition-all shadow-lg ${
        isCompleted 
          ? "bg-emerald-800 text-emerald-100 cursor-not-allowed" 
          : "bg-emerald-600 hover:bg-emerald-500 text-white"
      }`}
    >
      {isPending ? "جاري الحفظ..." : isCompleted ? "تم إتمام الدرس بنجاح! 🎉" : "تم إتمام الدرس ✅"}
    </button>
  );
}