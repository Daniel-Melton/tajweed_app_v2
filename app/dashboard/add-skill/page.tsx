"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const skillSchema = z.object({
  title: z.string().min(3, "العنوان قصير جداً"),
  slug: z.string().min(3, "الرابط قصير جداً"),
  concept: z.string().min(10, "الشرح يجب أن يكون مفصلاً"),
});

export default function AddSkillPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(skillSchema)
  });

  const onSubmit = async (data: any) => {
    // هنا سنقوم بإرسال البيانات للسيرفر
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-emerald-900 mb-8">إضافة حكم جديد</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">عنوان الحكم</label>
            <input {...register("title")} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="مثال: أحكام النون الساكنة" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">الرابط المختصر (Slug)</label>
            <input {...register("slug")} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="noon-sakinah" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">شرح الحكم</label>
            <textarea {...register("concept")} rows={4} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="اكتب شرح الحكم هنا..." />
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-3">رفع الملف الصوتي:</label>
            <UploadButton<OurFileRouter, "audioUploader">
              endpoint="audioUploader"
              onClientUploadComplete={(res) => alert("تم رفع الملف بنجاح!")}
              className="ut-button:bg-emerald-600 ut-button:text-white ut-button:rounded-xl"
            />
          </div>

          <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
            حفظ الحكم في الأكاديمية
          </button>
        </form>
      </div>
    </div>
  );
}