"use client";

import React from "react";
import { skillsDetailsBank } from "@/data/mockData";

interface SkillTreeProps {
  onSelectSkill: (skillKey: string) => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ onSelectSkill }) => {
  // تحويل كائن البيانات الجديد إلى مصفوفة لعرضها ديناميكياً
  const skillsArray = Object.values(skillsDetailsBank);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4" dir="rtl">
      {skillsArray.map((skill) => (
        <div
          key={skill.id}
          onClick={() => onSelectSkill(skill.id)}
          className="cursor-pointer p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-xl">
              📖
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {skill.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {skill.concept}
            </p>
          </div>
          
          <div className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>دخول الدرس والتطبيق ←</span>
            <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 px-2.5 py-1 rounded-md">
              {skill.quizPool.length} تمارين
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// التصدير كـ Default ليتوافق تماماً وبشكل قاطع مع الاستدعاء في الصفحة الرئيسية
export default SkillTree;