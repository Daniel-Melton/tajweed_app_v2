"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  addQuranExample,
  updateQuranExample,
  deleteQuranExample,
  downloadQuranAudio,
  ReciterKey,
} from "@/lib/actions";
import QuranExampleCard from "@/components/QuranExampleCard";
import LogoutButton from "@/components/LogoutButton";

interface SkillOption {
  id: string;
  title: string;
  order: number;
}

interface ExampleItem {
  id: string;
  skillId: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  verseText: string;
  highlights: string[];
  audioHusaryPath: string | null;
  audioMinshawiPath: string | null;
}

interface Props {
  skills: SkillOption[];
  initialExamples: ExampleItem[];
  /** لو جاي من رابط فيه ?skillId= (من صفحة الدرس نفسها) نختاره تلقائيًا */
  initialSkillId?: string;
}

interface Token {
  text: string;
  isWord: boolean;
}

/**
 * بيقسّم النص لرموز: كل رمز إما "كلمة" قابلة للاختيار أو "فراغ" بينهم،
 * بحيث لو جمعنا كل الرموز تاني هنرجع نفس النص الأصلي بالظبط (مهم عشان
 * التلوين النهائي يطابق verseText حرفيًا).
 */
function tokenize(text: string): Token[] {
  const matches = text.match(/\S+|\s+/g) || [];
  return matches.map((t) => ({ text: t, isWord: t.trim().length > 0 }));
}

/**
 * بيعيد بناء مجموعة الكلمات المحددة من مصفوفة highlights موجودة مسبقًا
 * (وقت فتح مثال للتعديل)، عن طريق مطابقة تسلسل كلمات كل مقطع تلوين
 * مع تسلسل كلمات النص الأصلي.
 */
function computeSelectedWordsFromHighlights(verseText: string, highlights: string[]): Set<number> {
  const words = tokenize(verseText)
    .filter((t) => t.isWord)
    .map((t) => t.text);
  const selected = new Set<number>();
  let cursor = 0;

  for (const h of highlights) {
    const hWords = tokenize(h)
      .filter((t) => t.isWord)
      .map((t) => t.text);
    if (hWords.length === 0) continue;

    for (let start = cursor; start <= words.length - hWords.length; start++) {
      let match = true;
      for (let k = 0; k < hWords.length; k++) {
        if (words[start + k] !== hWords[k]) {
          match = false;
          break;
        }
      }
      if (match) {
        for (let k = 0; k < hWords.length; k++) selected.add(start + k);
        cursor = start + hWords.length;
        break;
      }
    }
  }
  return selected;
}

export default function QuranExampleAdmin({ skills, initialExamples, initialSkillId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedSkillId, setSelectedSkillId] = useState(
    initialSkillId || skills[0]?.id || ""
  );
  const [surahName, setSurahName] = useState("");
  const [surahNumber, setSurahNumber] = useState("");
  const [ayahNumber, setAyahNumber] = useState("");
  const [verseText, setVerseText] = useState("");
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [examples, setExamples] = useState(initialExamples);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // لو الصفحة اتعمللها refresh من السيرفر بعد حفظ/حذف
  useEffect(() => setExamples(initialExamples), [initialExamples]);

  const tokens = useMemo(() => tokenize(verseText), [verseText]);

  // رقم تسلسلي للكلمات بس (من غير الفراغات) عشان التحديد يبقى بسيط
  const wordIndexByTokenIndex = useMemo(() => {
    const map: number[] = [];
    let w = 0;
    tokens.forEach((t) => {
      if (t.isWord) {
        map.push(w);
        w++;
      } else {
        map.push(-1);
      }
    });
    return map;
  }, [tokens]);

  function toggleWord(wordIndex: number) {
    setSelectedWords((prev) => {
      const next = new Set(prev);
      if (next.has(wordIndex)) next.delete(wordIndex);
      else next.add(wordIndex);
      return next;
    });
  }

  /**
   * بيبني مصفوفة التلوين النهائية من الكلمات المحددة: أي كلمات متجاورة
   * محددة بتتجمع (مع الفراغ اللي بينهم) في مقطع تلوين واحد متصل، بدل
   * ما تتلوّن كل كلمة لوحدها بمسافة فاصلة بينهم.
   */
  const highlights = useMemo(() => {
    const groups: string[] = [];
    let buffer = "";
    let bufferOpen = false;

    tokens.forEach((tok, i) => {
      if (tok.isWord) {
        const isSelected = selectedWords.has(wordIndexByTokenIndex[i]);
        if (isSelected) {
          buffer += tok.text;
          bufferOpen = true;
        } else if (bufferOpen) {
          groups.push(buffer.trim());
          buffer = "";
          bufferOpen = false;
        }
      } else if (bufferOpen) {
        buffer += tok.text;
      }
    });
    if (bufferOpen && buffer.trim()) groups.push(buffer.trim());
    return groups;
  }, [tokens, wordIndexByTokenIndex, selectedWords]);

  const examplesForSkill = examples.filter((e) => e.skillId === selectedSkillId);
  const totalWords = tokens.filter((t) => t.isWord).length;

  function resetForm() {
    setSurahName("");
    setSurahNumber("");
    setAyahNumber("");
    setVerseText("");
    setSelectedWords(new Set());
    setError(null);
    setEditingId(null);
  }

  function startEdit(ex: ExampleItem) {
    setEditingId(ex.id);
    setSurahName(ex.surahName);
    setSurahNumber(String(ex.surahNumber));
    setAyahNumber(String(ex.ayahNumber));
    setVerseText(ex.verseText);
    setSelectedWords(computeSelectedWordsFromHighlights(ex.verseText, ex.highlights));
    setError(null);
    // نزّل المستخدم لفورم التعديل
    requestAnimationFrame(() => {
      document.getElementById("quran-example-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleSubmit() {
    setError(null);
    if (!selectedSkillId || !surahName.trim() || !verseText.trim() || !ayahNumber || !surahNumber) {
      setError("من فضلك املأ كل الحقول (اسم السورة، رقمها، رقم الآية، نص الآية)");
      return;
    }
    if (highlights.length === 0) {
      setError("اضغط على الكلمة أو الكلمات اللي فيها الحكم عشان تتلوّن قبل الحفظ");
      return;
    }

    startTransition(async () => {
      try {
        if (editingId) {
          await updateQuranExample(editingId, {
            surahName,
            surahNumber: Number(surahNumber),
            ayahNumber: Number(ayahNumber),
            verseText,
            highlights,
          });
        } else {
          await addQuranExample({
            skillId: selectedSkillId,
            surahName,
            surahNumber: Number(surahNumber),
            ayahNumber: Number(ayahNumber),
            verseText,
            highlights,
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
      await deleteQuranExample(id);
      if (editingId === id) resetForm();
      router.refresh();
    });
  }

  async function handleDownload(example: ExampleItem, reciter: ReciterKey) {
    const key = `${example.id}-${reciter}`;
    setDownloadingKey(key);
    setDownloadError(null);
    try {
      const publicPath = await downloadQuranAudio(example.id, reciter);
      setExamples((prev) =>
        prev.map((e) =>
          e.id === example.id
            ? {
                ...e,
                ...(reciter === "husary"
                  ? { audioHusaryPath: publicPath }
                  : { audioMinshawiPath: publicPath }),
              }
            : e
        )
      );
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : "تعذّر تحميل الصوت");
    } finally {
      setDownloadingKey(null);
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-950 transition-colors" dir="rtl">
      <div className="max-w-3xl mx-auto p-6 md:p-8">
        {/* شريط أزرار علوي: الرئيسية / مشاهدة الدروس / تسجيل الخروج */}
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
            href="/dashboard/admin/questions"
            className="px-4 py-2 bg-white dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-gray-800 border border-emerald-200 dark:border-gray-800 text-emerald-700 dark:text-gray-300 rounded-xl text-sm font-bold transition-colors"
          >
            إدارة الأسئلة
          </Link>
          <div className="ms-auto">
            <LogoutButton variant="full" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-950 dark:text-white mb-1">
          إدارة الأمثلة القرآنية
        </h1>
        <p className="text-emerald-700/60 dark:text-gray-500 text-sm mb-6">
          اختر الدرس، الصق نص الآية، ثم اضغط على الكلمات اللي فيها الحكم عشان تتلوّن تلقائيًا.
        </p>

        {/* اختيار الدرس */}
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

        {/* الأمثلة الموجودة بالفعل لهذا الدرس */}
        {examplesForSkill.length > 0 && (
          <div className="mb-8 space-y-3">
            <h2 className="text-sm text-emerald-700/70 dark:text-gray-400">
              أمثلة مضافة لهذا الدرس ({examplesForSkill.length})
            </h2>
            {downloadError && <p className="text-red-500 dark:text-red-400 text-sm">{downloadError}</p>}
            {examplesForSkill.map((ex) => (
              <div
                key={ex.id}
                className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-emerald-950 dark:text-white truncate">{ex.verseText}</p>
                    <p className="text-xs text-emerald-700/60 dark:text-gray-500 mt-1">
                      {ex.surahName} (رقم {ex.surahNumber}) - آية {ex.ayahNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(ex)}
                      disabled={isPending}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-bold disabled:opacity-50"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ex.id)}
                      disabled={isPending}
                      className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm font-bold disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </div>

                {/* تحميل ودمج الصوت لكل قارئ */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-100 dark:border-gray-800">
                  {(
                    [
                      { key: "husary" as ReciterKey, label: "الحصري" },
                      { key: "minshawi" as ReciterKey, label: "المنشاوي" },
                    ] as const
                  ).map(({ key, label }) => {
                    const path = key === "husary" ? ex.audioHusaryPath : ex.audioMinshawiPath;
                    const isDownloading = downloadingKey === `${ex.id}-${key}`;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleDownload(ex, key)}
                        disabled={isDownloading}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                          path
                            ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900"
                            : "bg-emerald-100 dark:bg-gray-800 text-emerald-800 dark:text-gray-300 hover:bg-emerald-200 dark:hover:bg-gray-700 border border-emerald-200 dark:border-gray-700"
                        }`}
                      >
                        {isDownloading
                          ? "جاري التحميل..."
                          : path
                            ? `✅ ${label} (محمّل)`
                            : `⬇ تحميل صوت ${label}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* فورم إضافة/تعديل مثال */}
        <div id="quran-example-form" className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-6 space-y-5 scroll-mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {editingId ? "تعديل الآية" : "إضافة آية جديدة"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-emerald-700/60 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-white"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">اسم السورة</label>
              <input
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                placeholder="مثال: سورة البقرة"
                className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">رقم السورة (1-114)</label>
              <input
                type="number"
                value={surahNumber}
                onChange={(e) => setSurahNumber(e.target.value)}
                placeholder="مثال: 2"
                className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">رقم الآية</label>
              <input
                type="number"
                value={ayahNumber}
                onChange={(e) => setAyahNumber(e.target.value)}
                placeholder="مثال: 8"
                className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">
              نص الآية (الصق النص كامل بالتشكيل)
            </label>
            <textarea
              value={verseText}
              onChange={(e) => {
                setVerseText(e.target.value);
                setSelectedWords(new Set());
              }}
              rows={3}
              dir="rtl"
              className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600 text-lg leading-relaxed"
              placeholder="الصق نص الآية هنا..."
            />
          </div>

          {totalWords > 0 && (
            <div>
              <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">
                اضغط على الكلمة/الكلمات اللي فيها الحكم عشان تتلوّن
              </label>
              <div
                dir="rtl"
                className="p-4 bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 rounded-xl text-lg leading-loose flex flex-wrap gap-x-1 gap-y-2"
              >
                {tokens
                  .filter((t) => t.isWord)
                  .map((tok, filteredIndex) => {
                    const isSelected = selectedWords.has(filteredIndex);
                    return (
                      <button
                        type="button"
                        key={filteredIndex}
                        onClick={() => toggleWord(filteredIndex)}
                        className={`rounded px-1.5 py-0.5 transition-colors ${
                          isSelected
                            ? "bg-emerald-200 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400"
                            : "text-emerald-900 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {tok.text}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {verseText.trim() && surahName.trim() && surahNumber && ayahNumber && (
            <div>
              <p className="text-sm text-emerald-700/70 dark:text-gray-400 mb-2">معاينة</p>
              <QuranExampleCard
                surahName={surahName}
                surahNumber={Number(surahNumber) || 0}
                ayahNumber={Number(ayahNumber) || 0}
                verseText={verseText}
                highlights={highlights}
              />
            </div>
          )}

          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold transition"
          >
            {isPending ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "حفظ المثال"}
          </button>
        </div>
      </div>
    </div>
  );
}
