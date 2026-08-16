"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addQuranExample, updateQuranExample, deleteQuranExample } from "@/lib/actions";

type Example = {
  id: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  verseText: string;
  highlights: string[];
};

const emptyForm = { surahName: "", surahNumber: "", ayahNumber: "", verseText: "", highlights: "" };

export default function QuranExamplesManager({ skillId, examples }: { skillId: string; examples: Example[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (ex: Example) => {
    setEditingId(ex.id);
    setForm({
      surahName: ex.surahName,
      surahNumber: String(ex.surahNumber),
      ayahNumber: String(ex.ayahNumber),
      verseText: ex.verseText,
      highlights: ex.highlights.join("، "),
    });
  };

  const handleSubmit = () => {
    setError(null);
    if (!form.surahName.trim() || !form.verseText.trim() || !form.surahNumber) {
      setError("الرجاء ملء اسم السورة ورقمها ونص الآية");
      return;
    }
    const payload = {
      surahName: form.surahName.trim(),
      surahNumber: Number(form.surahNumber),
      ayahNumber: Number(form.ayahNumber) || 0,
      verseText: form.verseText.trim(),
      highlights: form.highlights
        .split(/[،,]/)
        .map((h) => h.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      try {
        if (editingId) {
          await updateQuranExample(editingId, payload);
        } else {
          await addQuranExample({ skillId, ...payload });
        }
        resetForm();
        router.refresh();
      } catch (e: any) {
        setError(e.message || "حصل خطأ أثناء الحفظ");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("متأكد من حذف المثال ده؟")) return;
    startTransition(async () => {
      try {
        await deleteQuranExample(id);
        router.refresh();
      } catch (e: any) {
        setError(e.message || "حصل خطأ أثناء الحذف");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {examples.map((ex) => (
          <div key={ex.id} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-start gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-600 dark:text-gray-300">
                {ex.surahName} - آية {ex.ayahNumber}
              </p>
              <p className="text-gray-800 dark:text-gray-100 mt-1" dir="rtl">
                {ex.verseText}
              </p>
              {ex.highlights.length > 0 && <p className="text-xs text-emerald-600 mt-1">تلوين: {ex.highlights.join("، ")}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(ex)} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm">
                تعديل
              </button>
              <button onClick={() => handleDelete(ex.id)} className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-lg text-sm">
                حذف
              </button>
            </div>
          </div>
        ))}
        {examples.length === 0 && <p className="text-gray-400 dark:text-gray-600 dark:text-gray-300 text-sm">لا توجد أمثلة بعد</p>}
      </div>

      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl space-y-3">
        <p className="font-medium text-gray-700 dark:text-gray-300">{editingId ? "تعديل مثال" : "إضافة مثال جديد"}</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="اسم السورة"
            value={form.surahName}
            onChange={(e) => setForm({ ...form, surahName: e.target.value })}
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <input
            placeholder="رقم السورة"
            type="number"
            value={form.surahNumber}
            onChange={(e) => setForm({ ...form, surahNumber: e.target.value })}
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <input
            placeholder="رقم الآية"
            type="number"
            value={form.ayahNumber}
            onChange={(e) => setForm({ ...form, ayahNumber: e.target.value })}
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <input
            placeholder="المقاطع المطلوب تلوينها (افصل بفاصلة)"
            value={form.highlights}
            onChange={(e) => setForm({ ...form, highlights: e.target.value })}
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <textarea
          placeholder="نص الآية كاملاً"
          value={form.verseText}
          onChange={(e) => setForm({ ...form, verseText: e.target.value })}
          rows={2}
          className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
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
