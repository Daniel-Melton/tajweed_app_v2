"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { skillsDetailsBank } from "@/data/mockData";

// تعريف الواجهة الخاصة ببيانات التقدم
interface ProgressData {
  totalStars: number;
  currentStreakDays: number;
  masteredSkillsCount: number;
  skillsStatus: Record<string, "learning" | "mastered">;
}

interface ProgressContextType {
  roadmapData: ProgressData;
  markSkillAsMastered: (skillId: string) => void;
  addStars: (amount: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  // بناء حالة ابتدائية متوافقة تماماً مع بنك البيانات الجديد
  const [roadmapData, setRoadmapData] = useState<ProgressData>({
    totalStars: 0,
    currentStreakDays: 1,
    masteredSkillsCount: 0,
    skillsStatus: Object.keys(skillsDetailsBank).reduce((acc, key) => {
      acc[key] = "learning"; // كل الأحكام تبدأ بقيد التعلم تلقائياً
      return acc;
    }, {} as Record<string, "learning" | "mastered">),
  });

  // دالة تحويل الحكم إلى مقتن وزيادة العداد بشكل سليم
  const markSkillAsMastered = (skillId: string) => {
    setRoadmapData((prev) => {
      if (prev.skillsStatus[skillId] === "mastered") return prev; // مقتنة بالفعل

      const updatedStatus = { ...prev.skillsStatus, [skillId]: "mastered" as const };
      const masteredCount = Object.values(updatedStatus).filter((status) => status === "mastered").length;

      return {
        ...prev,
        skillsStatus: updatedStatus,
        masteredSkillsCount: masteredCount,
        totalStars: prev.totalStars + 10, // مكافأة إتقان الحكم
      };
    });
  };

  // دالة إضافة نجوم عند حل التمارين
  const addStars = (amount: number) => {
    setRoadmapData((prev) => ({
      ...prev,
      totalStars: prev.totalStars + amount,
    }));
  };

  return (
    <ProgressContext.Provider value={{ roadmapData, markSkillAsMastered, addStars }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}