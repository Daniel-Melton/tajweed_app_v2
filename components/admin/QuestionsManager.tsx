"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addQuestion, updateQuestion, deleteQuestion } from "@/lib/actions";

type QuestionItem = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  points: number;
};

const emptyForm = { questionText: "", options: ["", "", "", ""], correctAnswer: "", points: "1" };

export default function QuestionsManager({ skillId, questions }: { skillId: string; questions: QuestionItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (q: QuestionItem) => {
    setEditingId(q.id);
    const opts = [...q.options];
    while (opts.length < 4) opts.push("");
    setForm({ questionText: q.questionText, options: opts, correctAnswer: q.correctAnswer, points: String(q.points) });
  };

  const updateOption = (i: number, value: string) => {
    const options = [...form.options];
    options[i] = value;
    setForm({ ...form, options });
  };

  const handleSubmit = () => {
    setError(null);
    const options = form.options.map((o) => o.trim()).filter(Boolean);
    if (!form.questionText.trim() || options.length < 2 || !form.correctAnswer.trim()) {
      setError("الرجاء ملء نص السؤال، خيارين على الأقل، وتحديد الإجابة الصحيحة");
      return;
    }
    if (!options.includes(form.correctAnswer.trim())) {
      setError("الإجابة الصحيحة لازم تكون واحدة من الخيارات المكتوبة");
      return;
    }
    const payload = {
      questionText: form.questionText.trim(),
      options,
      correctAnswer: form.correctAnswer.trim(),
      points: Number(form.points) || 1,
    };

    startTransition(async () => {
      try {
        if (editingId) {
          await updateQuestion(editingId, payload);
        } else {
          await addQuestion({ skillId, ...payload });
        }
        resetForm();
        router.refresh();
      } catch (e: any) {
        setError(e.message || "حصل خطأ أثناء الحفظ");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("متأكد من حذف السؤال ده؟")) return;
    startTransition(async () => {
      try {
        await deleteQuestion(id);
        router.refresh();
      } catch (e: any) {
        setError(e.message || "حصل خطأ أثناء الحذف");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-start gap-4">
            <div>
              <p className="text-gray-800 dark:text-gray-100 font-medium">{q.questionText}</p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-600 dark:text-gray-300 mt-1 space-y-0.5">
                {q.options.map((o) => (
                  <li key={o} className={o === q.correctAnswer ? "text-emerald-600 font-medium" : ""}>
                    {o === q.correctAnswer ? "✓ " : "- "}
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(q)} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm">
                تعديل
              </button>
              <button onClick={() => handleDelete(q.id)} className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-lg text-sm">
                حذف
              </button>
            </div>
          </div>
        ))}
        {questions.length === 0 && <p className="text-gray-400 dark:text-gray-600 dark:text-gray-300 text-sm">لا توجد أسئلة بعد</p>}
      </div>

      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl space-y-3">
        <p className="font-medium text-gray-700 dark:text-gray-300">{editingId ? "تعديل سؤال" : "إضافة سؤال جديد"}</p>
        <textarea
          placeholder="نص السؤال"
          value={form.questionText}
          onChange={(e) => setForm({ ...form, questionText: e.target.value })}
          rows={2}
          className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <div className="grid grid-cols-2 gap-3">
          {form.options.map((opt, i) => (
            <input
              key={i}
              placeholder={`خيار ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.correctAnswer}
            onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">اختر الإجابة الصحيحة</option>
            {form.options.filter(Boolean).map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="النقاط"
            value={form.points}
            onChange={(e) => setForm({ ...form, points: e.target.value })}
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {isPending ? "جاري الحفظ..." : editingId ? "حفظ التعديل" : "إضافة"}
          </button>
          {editingId && (
            <button onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 dark:text-gray-300 rounded-lg text-sm">
              إلغاء
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
