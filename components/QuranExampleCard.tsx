"use client";

import { useState } from "react";
import { getLiveAyahAudioUrl, ReciterKey } from "@/lib/actions";

interface QuranExampleCardProps {
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  verseText: string;
  /** المقاطع المطلوب تلوينها (لازم تطابق نص verseText حرفيًا بنفس التشكيل) */
  highlights: string[];
  /** مسار الملف المحلي بعد التحميل (لو موجود بيتشغل بدل ما نضرب الـ API) */
  audioHusaryPath?: string | null;
  audioMinshawiPath?: string | null;
}

/** بيهرب رموز الـ regex الخاصة عشان نقدر نستخدم أي مقطع نص كـ pattern بأمان */
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * بيقسّم نص الآية على المقاطع المطلوب تلوينها، مع تفضيل أطول مقطع
 * أولًا عشان لو مقطعين متداخلين، الأطول ياخد الأولوية.
 */
function splitWithHighlights(verseText: string, highlights: string[]) {
  const cleaned = highlights.filter((h) => h.trim().length > 0);
  if (cleaned.length === 0) return [{ text: verseText, highlighted: false }];

  const sorted = [...cleaned].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "g");
  const highlightSet = new Set(cleaned);

  return verseText
    .split(pattern)
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, highlighted: highlightSet.has(part) }));
}

const RECITER_LABELS: Record<ReciterKey, string> = {
  husary: "الحصري",
  minshawi: "المنشاوي",
};

/** بطاقة عرض آية قرآنية مع تلوين الحروف/الكلمات المستهدفة + مشغّل صوت باختيار القارئ */
export default function QuranExampleCard({
  surahName,
  surahNumber,
  ayahNumber,
  verseText,
  highlights,
  audioHusaryPath,
  audioMinshawiPath,
}: QuranExampleCardProps) {
  const parts = splitWithHighlights(verseText, highlights);

  const [reciter, setReciter] = useState<ReciterKey>("husary");
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const localPath = reciter === "husary" ? audioHusaryPath : audioMinshawiPath;
  const src = localPath || liveUrl;

  function selectReciter(r: ReciterKey) {
    if (r === reciter) return;
    setReciter(r);
    setLiveUrl(null);
    setAudioError(null);
  }

  async function handlePlayClick() {
    if (src) return;
    setLoading(true);
    setAudioError(null);
    try {
      const url = await getLiveAyahAudioUrl(surahNumber, ayahNumber, reciter);
      setLiveUrl(url);
    } catch {
      setAudioError("تعذّر تحميل الصوت الآن، حاول تاني");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-emerald-100 dark:border-gray-800 rounded-2xl p-6 md:p-8 transition-colors">
      <p
        className="text-2xl md:text-3xl leading-[2.6] text-center font-semibold text-emerald-950 dark:text-gray-100"
        dir="rtl"
      >
        {parts.map((part, i) =>
          part.highlighted ? (
            <span
              key={i}
              className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 rounded px-1 mx-0.5"
            >
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </p>
      <p className="text-center text-emerald-700/60 dark:text-gray-500 text-sm mt-4">
        {surahName} - آية {ayahNumber}
      </p>

      {/* مشغّل الصوت + اختيار القارئ */}
      <div className="mt-5 pt-5 border-t border-emerald-100 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex gap-2 shrink-0">
          {(Object.keys(RECITER_LABELS) as ReciterKey[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => selectReciter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                reciter === r
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 dark:bg-gray-900 text-emerald-700 dark:text-gray-400 hover:text-emerald-900 dark:hover:text-gray-200 border border-emerald-200 dark:border-gray-800"
              }`}
            >
              {RECITER_LABELS[r]}
            </button>
          ))}
        </div>

        {src ? (
          <audio controls src={src} className="w-full sm:flex-1 h-10" />
        ) : (
          <button
            type="button"
            onClick={handlePlayClick}
            disabled={loading}
            className="px-4 py-2 bg-emerald-50 dark:bg-gray-900 hover:bg-emerald-100 dark:hover:bg-gray-800 border border-emerald-200 dark:border-gray-800 text-emerald-800 dark:text-gray-200 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {loading ? "جاري التحميل..." : `▶ تشغيل تلاوة ${RECITER_LABELS[reciter]}`}
          </button>
        )}
      </div>
      {audioError && <p className="text-red-500 dark:text-red-400 text-xs mt-2">{audioError}</p>}
    </div>
  );
}
