"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createSkill, updateSkill } from "@/lib/actions";

const skillSchema = z.object({
  title: z.string().min(3, "العنوان قصير جداً"),
  slug: z
    .string()
    .min(3, "الرابط قصير جداً")
    .regex(/^[a-z0-9-]+$/, "الرابط لازم يكون حروف إنجليزية صغيرة وأرقام وشرطات بس"),
  concept: z.string().min(10, "الشرح يجب أن يكون مفصلاً"),
  videoUrl: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
});

type SkillFormValues = z.infer<typeof skillSchema>;

export default function SkillForm({
  mode,
  skill,
}: {
  mode: "create" | "edit";
  skill?: { id: string; title: string; slug: string; concept: string; videoUrl: string | null; order: number };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: skill
      ? {
          title: skill.title,
          slug: skill.slug,
          concept: skill.concept,
          videoUrl: skill.videoUrl ?? "",
          order: skill.order,
        }
      : undefined,
  });

  const onSubmit = (data: SkillFormValues) => {
    setServerError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        if (mode === "create") {
          const created = await createSkill(data);
          router.push(`/dashboard/admin/skills/${created.id}/edit`);
        } else if (skill) {
          await updateSkill(skill.id, { ...data, order: data.order ?? skill.order });
          setSuccess(true);
          router.refresh();
        }
      } catch (e: any) {
        setServerError(e.message || "حصل خطأ غير متوقع");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">عنوان الدرس</label>
        <input
          {...register("title")}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
          placeholder="مثال: المد الطبيعي وأنواعه الفرعية"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الرابط المختصر (Slug)</label>
        <input
          {...register("slug")}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
          placeholder="natural-madd-subtypes"
          dir="ltr"
        />
        {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">شرح الدرس</label>
        <textarea
          {...register("concept")}
          rows={4}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
          placeholder="اكتب شرح الحكم هنا..."
        />
        {errors.concept && <p className="text-xs text-red-600">{errors.concept.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">رابط الفيديو (اختياري)</label>
        <input
          {...register("videoUrl")}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
          placeholder="https://..."
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          الترتيب في الشجرة {mode === "create" && "(اختياري، هيتحدد تلقائي لو سبته فاضي)"}
        </label>
        <input
          type="number"
          {...register("order")}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
        />
      </div>

      {serverError && <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-xl text-sm">{serverError}</div>}
      {success && <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm">تم الحفظ بنجاح</div>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 disabled:opacity-50"
      >
        {isPending ? "جاري الحفظ..." : mode === "create" ? "إنشاء الدرس" : "حفظ التعديلات"}
      </button>
    </form>
  );
}
