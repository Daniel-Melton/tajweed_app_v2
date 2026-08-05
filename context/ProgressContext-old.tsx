// context/ProgressContext.tsx
"use client";

import React, { createContext, useContext, useState } from 'react';
import { mockRoadmapData } from '@/data/mockData';

interface ProgressContextType {
  roadmapData: typeof mockRoadmapData;
  activeSkillKey: string | null;
  setActiveSkillKey: (key: string | null) => void;
  completeSkill: (key: string, stars: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [roadmapData, setRoadmapData] = useState(mockRoadmapData);
  const [activeSkillKey, setActiveSkillKey] = useState<string | null>(null);

  const completeSkill = async (key: string, stars: number) => {
    // 1. تجميع كل الأحكام في مصفوفة واحدة مسطحة لمعرفة الترتيب الكلي
    const allSkills = roadmapData.roadmap.flatMap(stage => stage.skills);
    
    // 2. إيجاد مؤشر (Index) الحكم الحالي الذي انتهى المستخدم منه
    const currentSkillIndex = allSkills.findIndex(skill => skill.key === key);
    
    // 3. تحديد مفتاح الحكم التالي إذا كان موجوداً
    const nextSkillKey = currentSkillIndex !== -1 && currentSkillIndex + 1 < allSkills.length 
      ? allSkills[currentSkillIndex + 1].key 
      : null;

    // 4. تحديث حالة الأحكام داخل المراحل والمستويات ديناميكياً
    const updatedRoadmap = roadmapData.roadmap.map(stage => ({
      ...stage,
      skills: stage.skills.map(skill => {
        // إذا كان هذا هو الحكم الحالي، حوّل حالته إلى متقن (mastered) وحدّث النجوم
        if (skill.key === key) {
          return { ...skill, status: 'mastered' as const, stars };
        }
        // تم التعديل هنا: تحويل الحالة إلى 'learning' بدلاً من 'unlocked' ليتوافق مع الـ Types
        if (nextSkillKey && skill.key === nextSkillKey && skill.status === 'locked') {
          return { ...skill, status: 'learning' as const };
        }
        return skill;
      })
    }));

    // 5. تحديث الـ State الإجمالية للتطبيق والعدادات العلوية مع الحفاظ على بقية الخصائص مثل currentStreakDays
    setRoadmapData(prev => ({
      ...prev,
      totalStars: prev.totalStars + stars,
      roadmap: updatedRoadmap
    }));

    setActiveSkillKey(null); // العودة للخريطة الرئيسية

    // 6. إرسال طلب الحفظ للسيرفر الخلفي
    try {
      await fetch('/api/v1/skills/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: roadmapData.userId, skillKey: key, stars })
      });
    } catch (error) {
      console.error("Failed to update progress on server", error);
    }
  };

  return (
    <ProgressContext.Provider value={{ roadmapData, activeSkillKey, setActiveSkillKey, completeSkill }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used within a ProgressProvider");
  return context;
};