"use client";

import React from "react";
import DashboardStats from "@/components/DashboardStats";
import SkillTree from "@/components/SkillTree";
import { useProgress } from "@/context/ProgressContext";
import { skillsDetailsBank } from "@/data/mockData";

export default function DashboardPage() {
  const { roadmapData } = useProgress();

  // حساب الأرقام بدقة تامة لمنع خطأ الـ ts(2363) نهائياً في صفحة الـ Dashboard
  const totalSkillsCount = Number(Object.keys(skillsDetailsBank).length || 0);
  const masteredCount = Number(roadmapData?.masteredSkillsCount || 0);
  const learningCount = Number(totalSkillsCount - masteredCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* رأس الصفحة الترحيبي */}
        <div className="text-right space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            لوحة المتابعة التجويدية 📊
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            تابعي تقدمكِ الحالي، واجمعي النجوم للوصول إلى الإتقان الكامل لكتاب الله.
          </p>
        </div>

        {/* 1. مكون الإحصائيات الذكي */}
        <DashboardStats />

        {/* 2. قسم شجرة الأحكام والمهارات المحدثة */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="mb-6 text-right">
            <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100">
              أبواب علم التجويد المتاحة 📖
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              اضغطي على أي حكم للبدء في قراءة الشرح الميسر والاستماع إلى الـ 5 أمثلة الصوتية ثم دخول الاختبار.
            </p>
          </div>

          {/* استدعاء الشجرة مع دالة اختيار فارغة أو الربط مع الـ Navigation عندك */}
          <SkillTree onSelectSkill={(skillId) => {
            // هنا يتم توجيه المستخدم لصفحة الدرس أو عرض الـ LessonContainer
            window.location.href = `/?skill=${skillId}`; 
          }} />
        </div>

      </div>
    </div>
  );
}