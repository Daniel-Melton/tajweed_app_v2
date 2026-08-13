"use client";

import { useState } from "react";
import Link from "next/link";
import PracticeSection from "@/components/PracticeSection";
import CompleteButton from "@/components/CompleteButton";
import { saveTestResult } from "@/lib/actions";

interface QuestionData {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  skillId: string;
  skillSlug: string;
  skillTitle: string;
  userId: string;
  initialCompleted: boolean;
  nextHref: string;
  questions: QuestionData[];
  isAdmin: boolean;
  manageQuestionsHref: string;
}

export default function LessonCompletionFlow({
  skillId,
  skillSlug,
  skillTitle,
  userId,
  initialCompleted,
  nextHref,
  questions,
  isAdmin,
  manageQuestionsHref,
}: Props) {
  const hasQuestions = questions.length > 0;
  const [practiceResult, setPracticeResult] = useState<{ score: number; total: number } | null>(
    null
  );
  const practiceFinished = !hasQuestions || practiceResult !== null;

  function handlePracticeFinish(score: number, total: number) {
    setPracticeResult({ score, total });
    saveTestResult({ userId, skillSlug, skillTitle, score, totalQuestions: total }).catch(() => {
      // مش هنوقف تجربة الطالب لو تسجيل الإحصائية فشل — التقدم الأساسي (isCompleted) بيتسجل بشكل منفصل
    });
  }

  return (
    <>
      {hasQuestions && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm">
                📝
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-400">تمارين تفاعلية</h2>
            </div>
            {isAdmin && (
              <Link
                href={manageQuestionsHref}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-800 text-emerald-700 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-white hover:border-emerald-600 transition-colors"
              >
                ✏️ إدارة أسئلة هذا الدرس
              </Link>
            )}
          </div>
          <PracticeSection
            questions={questions}
            onFinish={handlePracticeFinish}
          />
        </div>
      )}

      {isAdmin && !hasQuestions && (
        <div className="mt-8">
          <Link
            href={manageQuestionsHref}
            className="inline-block text-sm px-4 py-2 rounded-lg bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-800 text-emerald-700 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-white hover:border-emerald-600 transition-colors"
          >
            ✏️ إضافة أسئلة تمارين لهذا الدرس
          </Link>
        </div>
      )}

      <div className="mt-10">
        <CompleteButton
          skillId={skillId}
          userId={userId}
          initialCompleted={initialCompleted}
          disabledUntilPractice={!practiceFinished}
          nextHref={nextHref}
          practiceScore={practiceResult}
        />
      </div>
    </>
  );
}
