"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addQuestion, updateQuestion, deleteQuestion } from "@/lib/actions";
import LogoutButton from "@/components/LogoutButton";

interface SkillOption {
  id: string;
  title: string;
  order: number;
}

interface QuestionItem {
  id: string;
  skillId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface Props {
  skills: SkillOption[];
  initialQuestions: QuestionItem[];
  initialSkillId?: string;
}

const EMPTY_OPTIONS = ["", "", "", ""];

export default function QuestionsAdmin({ skills, initialQuestions, initialSkillId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedSkillId, setSelectedSkillId] = useState(initialSkillId || skills[0]?.id || "");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(EMPTY_OPTIONS);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState(initialQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => setQuestions(initialQuestions), [initialQuestions]);

  const questionsForSkill = questions.filter((q) => q.skillId === selectedSkillId);
  const filledOptions = options.map((o) => o.trim()).filter(Boolean);

  function resetForm() {
    setQuestionText("");
    setOptions(EMPTY_OPTIONS);
    setCorrectAnswer("");
    setError(null);
    setEditingId(null);
  }

  function startEdit(q: QuestionItem) {
    setEditingId(q.id);
    setQuestionText(q.questionText);
    const padded = [...q.options];
    while (padded.length < 4) padded.push("");
    setOptions(padded);
    setCorrectAnswer(q.correctAnswer);
    setError(null);
    requestAnimationFrame(() => {
      document.getElementById("question-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function updateOption(index: number, value: string) {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = value;
      // لو الخيار اللي بيتعدل كان هو المحدد كإجابة صحيحة والقيمة اتغيرت، نلغي التحديد
      if (correctAnswer && prev[index] === correctAnswer && value !== correctAnswer) {
        setCorrectAnswer("");
      }
      return next;
    });
  }

  function handleSubmit() {
    setError(null);
    if (!selectedSkillId || !questionText.trim()) {
      setError("من فضلك اكتب نص السؤال");
      return;
    }
    if (filledOptions.length < 2) {
      setError("لازم خيارين على الأقل");
      return;
    }
    if (!correctAnswer || !filledOptions.includes(correctAnswer)) {
      setError("اختر الإجابة الصحيحة من الخيارات");
      return;
    }

    startTransition(async () => {
      try {
        if (editingId) {
          await updateQuestion(editingId, {
            questionText,
            options: filledOptions,
            correctAnswer,
          });
        } else {
          await addQuestion({
            skillId: selectedSkillId,
            questionText,
            options: filledOptions,
            correctAnswer,
          });
        }
        resetForm();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteQuestion(id);
      if (editingId === id) resetForm();
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-950 transition-colors" dir="rtl">
      <div className="max-w-3xl mx-auto p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Link
            href="/"
            className="px-4 py-2 bg-white dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-gray-800 border border-emerald-200 dark:border-gray-800 text-emerald-700 dark:text-gray-300 rounded-xl text-sm font-bold transition-colors"
          >
            الرئيسية
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-gray-800 border border-emerald-200 dark:border-gray-800 text-emerald-700 dark:text-gray-300 rounded-xl text-sm font-bold transition-colors"
          >
            مشاهدة الدروس
          </Link>
          <Link
            href="/dashboard/admin/quran-examples"
            className="px-4 py-2 bg-white dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-gray-800 border border-emerald-200 dark:border-gray-800 text-emerald-700 dark:text-gray-300 rounded-xl text-sm font-bold transition-colors"
          >
            الأمثلة القرآنية
          </Link>
          <div className="ms-auto">
            <LogoutButton variant="full" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-950 dark:text-white mb-1">إدارة الأسئلة</h1>
        <p className="text-emerald-700/60 dark:text-gray-500 text-sm mb-6">
          اختر الدرس، اكتب السؤال والخيارات، وحدّد الإجابة الصحيحة.
        </p>

        <div className="mb-6">
          <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">الدرس</label>
          <select
            value={selectedSkillId}
            onChange={(e) => setSelectedSkillId(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
          >
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.order}. {s.title}
              </option>
            ))}
          </select>
        </div>

        {questionsForSkill.length > 0 && (
          <div className="mb-8 space-y-3">
            <h2 className="text-sm text-emerald-700/70 dark:text-gray-400">أسئلة هذا الدرس ({questionsForSkill.length})</h2>
            {questionsForSkill.map((q) => (
              <div key={q.id} className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-emerald-950 dark:text-white font-semibold">{q.questionText}</p>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(q)}
                      disabled={isPending}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-bold disabled:opacity-50"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      disabled={isPending}
                      className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm font-bold disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <span
                      key={opt}
                      className={`text-xs px-2 py-1 rounded-lg ${
                        opt === q.correctAnswer
                          ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900"
                          : "bg-emerald-100 dark:bg-gray-800 text-emerald-700 dark:text-gray-400"
                      }`}
                    >
                      {opt} {opt === q.correctAnswer && "✓"}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div id="question-form" className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-6 space-y-5 scroll-mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {editingId ? "تعديل السؤال" : "إضافة سؤال جديد"}
            </h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-xs text-emerald-700/60 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-white">
                إلغاء التعديل
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">نص السؤال</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={2}
              dir="rtl"
              className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600 text-base"
              placeholder="مثال: ما حكم النون الساكنة إذا جاء بعدها حرف الباء؟"
            />
          </div>

          <div>
            <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">
              الخيارات (اكتب على الأقل خيارين، واضغط على الصح بجانب الإجابة الصحيحة)
            </label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => opt.trim() && setCorrectAnswer(opt.trim())}
                    disabled={!opt.trim()}
                    title="حدد كإجابة صحيحة"
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-30 ${
                      opt.trim() && correctAnswer === opt.trim()
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 dark:bg-gray-800 text-emerald-700/50 dark:text-gray-500 hover:text-emerald-900 dark:hover:text-gray-300"
                    }`}
                  >
                    ✓
                  </button>
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`خيار ${i + 1}`}
                    dir="rtl"
                    className="flex-1 p-2.5 rounded-lg bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold transition"
          >
            {isPending ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "حفظ السؤال"}
          </button>
        </div>
      </div>
    </div>
  );
}
