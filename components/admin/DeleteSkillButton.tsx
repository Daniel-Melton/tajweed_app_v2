"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSkill } from "@/lib/actions";

export default function DeleteSkillButton({ skillId, skillTitle }: { skillId: string; skillTitle: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = () => {
    const confirmed = confirm(`متأكد إنك عايز تحذف درس "${skillTitle}"؟ هيتحذف معاه كل الأمثلة والأسئلة وتقدم الطلاب المرتبط بيه.`);
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      try {
        await deleteSkill(skillId);
        router.refresh();
      } catch (e: any) {
        setError(e.message || "حصل خطأ أثناء الحذف");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="px-3 py-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
      >
        {isPending ? "جاري الحذف..." : "حذف"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
