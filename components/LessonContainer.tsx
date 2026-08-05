"use client";

import React, { useState } from "react";
import { skillsDetailsBank } from "@/data/mockData";

interface LessonContainerProps {
  skillId: string;
  onBack: () => void;
}

export const LessonContainer: React.FC<LessonContainerProps> = ({ skillId, onBack }) => {
  const lessonData = skillsDetailsBank[skillId];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  // حالة لحفظ الفهرس الصوتي المشغل حالياً
  const [playingAudioIdx, setPlayingAudioIdx] = useState<number | null>(null);

  if (!lessonData) {
    return (
      <div className="p-6 text-center text-red-500 font-bold" dir="rtl">
        ⚠️ عذراً، لم يتم العثور على تفاصيل هذا الحكم البرمجي التعليمي.
      </div>
    );
  }

  const currentQuestion = lessonData.quizPool?.[currentQuestionIndex];

  // دالة لتشغيل وإيقاف الصوت الاسترشادي للآيات بشكل آمن تماماً في Next.js لمنع الـ Runtime Errors
  const toggleAudio = async (url: string, index: number) => {
    // منع المعالجة واستعراض تحذير لطيف إذا كان الرابط لا يزال افتراضياً أو قيد الرفع والتهيئة
    if (!url || url.includes("الرابط_الخاص") || url.startsWith("https://www.")) {
      alert("✨ تنبيه: جاري رفع وتجهيز هذا الملف الصوتي النقي للشيخ قريباً برابط المجلد المحلي!");
      return;
    }

    const audioElements = document.getElementsByTagName("audio");
    
    // إيقاف أي مقاطع صوتية أخرى تعمل حالياً لمنع التداخل والتشويش على أمهاتنا
    for (let i = 0; i < audioElements.length; i++) {
      if (i !== index) {
        audioElements[i].pause();
        audioElements[i].currentTime = 0;
      }
    }

    const currentAudio = document.getElementById(`audio-${index}`) as HTMLAudioElement;
    
    if (currentAudio) {
      try {
        if (playingAudioIdx === index) {
          currentAudio.pause();
          setPlayingAudioIdx(null);
        } else {
          // تشغيل غير متزامن آمن بالكامل ومتوافق مع محركات المتصفحات الحديثة
          await currentAudio.play();
          setPlayingAudioIdx(index);
          currentAudio.onended = () => setPlayingAudioIdx(null);
        }
      } catch (error) {
        console.error("Audio playback safely caught block:", error);
        alert("تنبيه: تعذر تحميل الصوت، يرجى التأكد من وضع ملف الـ mp3 داخل مجلد public بالمسار الموضح.");
        setPlayingAudioIdx(null);
      }
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleVerifyAnswer = () => {
    if (!selectedOptionId || isAnswered) return;
    setIsAnswered(true);
    const isCorrect = currentQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect;
    if (isCorrect) setScore((prev) => prev + 1);
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    if (currentQuestionIndex + 1 < lessonData.quizPool.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      alert(`🎉 تهانينا الطيبة! أكملتِ مراجعة واختبار هذا الحكم بنتيجة: ${score} من ${lessonData.quizPool.length}`);
      onBack();
    }
  };

  // دالة ذكية لتلوين وتحديد حروف مصحف التجويد التفاعلي بصرياً بناءً على الكلمة المقروءة لراحة كبار السن
  const highlightTextExample = (text: string) => {
    if (text.includes("مِنْ حَكِيمٍ")) {
      return (
        <span>
          مِ<span className="text-gray-400 font-bold bg-slate-100 px-1 rounded">نْ</span>{" "}
          <span className="text-red-600 font-black text-2xl">حَ</span>كِيمٍ
        </span>
      );
    }
    if (text.includes("أَنْعَمْتَ")) {
      return (
        <span>
          أَ<span className="text-gray-400 font-bold bg-slate-100 px-1 rounded">نْ</span>
          <span className="text-red-600 font-black text-2xl">عَ</span>مْتَ
        </span>
      );
    }
    if (text.includes("عَذَابٌ أَلِيمٌ")) {
      return (
        <span>
          عَذَابُ<span className="text-emerald-600 font-bold">ٌ</span>{" "}
          <span className="text-red-600 font-black text-2xl">أَ</span>لِيمٌ
        </span>
      );
    }
    if (text.includes("مَن يَقُولُ")) {
      return (
        <span>
          مَ<span className="text-emerald-500 font-bold bg-emerald-50 px-0.5 rounded">ن يَ</span>قُولُ
        </span>
      );
    }
    if (text.includes("مِن رَّبِّهِمْ")) {
      return (
        <span>
          مِ<span className="text-gray-300 line-through">ن</span> <span className="text-indigo-600 font-bold text-2xl">رَّ</span>بِّهِمْ
        </span>
      );
    }
    if (text.includes("مِن بَعْدِ")) {
      return (
        <span>
          مِ<span className="text-amber-600 font-bold bg-amber-50 px-1 rounded text-xl">مْ</span> 
          <span className="text-indigo-600 font-black text-2xl">بَ</span>عْدِ
        </span>
      );
    }
    if (text.includes("أَنتُمْ")) {
      return (
        <span>
          أَ<span className="text-teal-600 font-bold bg-teal-50 px-1 rounded">نْـ</span>
          <span className="text-teal-600 font-bold">تُ</span>مْ
        </span>
      );
    }
    return <span>{text}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800" dir="rtl">
      
      {/* الهيدر العلوي ومفتاح العودة للوحة التحكم */}
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
          درس علمي مُوسع: {lessonData.title}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition"
        >
          العودة للخريطة 🗺️
        </button>
      </div>

      {!showQuiz ? (
        <div className="space-y-8">
          
          {/* 1. قسم الشرح الموسع والديناميكي الخالي من التكرار والنصوص الثابتة */}
          <section className="space-y-4">
            <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50">
              <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-3">📖 الشرح الفقهي والعملي المبسط:</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
                {lessonData.concept}
              </p>
              
              <div className="border-t pt-4 mt-4 border-indigo-100/60 dark:border-indigo-900/40 space-y-3 text-base text-gray-600 dark:text-gray-400">
                {lessonData.namingReason && (
                  <p>
                    💡 <strong className="text-indigo-700 dark:text-indigo-400">لماذا سُمي بهذا الاسم؟</strong> {lessonData.namingReason}
                  </p>
                )}
                {lessonData.importantWarning && (
                  <p>
                    ⚠️ <strong className="text-amber-700 dark:text-amber-400">تنبيه هام جداً عند القراءة والتلاوة:</strong> {lessonData.importantWarning}
                  </p>
                )}
              </div>
            </div>

            {/* صندوق التشبيه والتقريب التوضيحي الديناميكي */}
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-100/40 text-lg">
              <p className="text-gray-700 dark:text-gray-300 font-medium italic">
                {lessonData.analogy}
              </p>
            </div>
          </section>

          {/* 2. قسم الفيديو والموشن جرافيك التعليمي المتغير */}
          {lessonData.videoUrl && !lessonData.videoUrl.includes("المقترح") && (
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                🎬 الشرح المرئي المتحرك (موشن جرافيك):
              </h3>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
                <iframe
                  src={lessonData.videoUrl}
                  title={`شرح مرئي متحرك لحكم ${lessonData.title}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* 3. التطبيق الصوتي المرئي عالي الجودة لكبار المقرئين */}
          {lessonData.audioGuides && lessonData.audioGuides.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                🔊 التلاوة الاسترشادية المصحوبة بالتحكم الصوتي التفاعلي:
              </h3>
              <p className="text-sm text-gray-500 -mt-2">
                استمعي بتركيز ونظافة تامة لصوت الحرف والغنّة، وحاولي محاكاة تلاوة الشيوخ الكرام برفق:
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {lessonData.audioGuides.map((audio, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {/* عرض الآية بالتلوين التجويدي المناسب */}
                    <div className="text-2xl font-serif font-bold text-center sm:text-right text-gray-850 dark:text-gray-150 tracking-wide">
                      ﴿ {highlightTextExample(audio.text)} ﴾
                    </div>
                    
                    {/* أزرار التشغيل والتحكم الصامت في Next.js */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-left hidden sm:block">
                        <span className="block text-xs text-gray-400">بصوت القارئ:</span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{audio.reciter}</span>
                      </div>
                      
                      <button
                        onClick={() => toggleAudio(audio.url, idx)}
                        className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm transition ${
                          playingAudioIdx === idx 
                            ? "bg-red-600 hover:bg-red-700 text-white" 
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        {playingAudioIdx === idx ? "🛑 إيقاف التلاوة" : `🔊 استماع للمثال`}
                      </button>

                      {/* عنصر HTML5 الصوتي الخفي بدون preload افتراضي لتفادي استهلاك النطاق وتجنب الـ Error */}
                      <audio id={`audio-${idx}`} src={audio.url} preload="none" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* زر التبديل والوصول للأسئلة التطبيقية */}
          <div className="pt-4">
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl transition shadow-md"
            >
              🚀 انتقلي الآن للاختبار والتمارين التطبيقية للحكم
            </button>
          </div>
        </div>
      ) : (
        /* واجهة لوحة الاختبار والأسئلة (تلقائية بالكامل من كائن البيانات) */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              السؤال {currentQuestionIndex + 1} من {lessonData.quizPool?.length}
            </span>
            <span className="text-sm font-semibold text-emerald-600">النقاط الحالية: {score}</span>
          </div>

          {currentQuestion && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-850 dark:text-gray-100">{currentQuestion.question}</h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  let optionStyle = "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800";
                  if (selectedOptionId === option.id) optionStyle = "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/25";
                  if (isAnswered) {
                    if (option.isCorrect) optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                    else if (selectedOptionId === option.id) optionStyle = "border-red-500 bg-red-50 text-red-900";
                    else optionStyle = "border-gray-100 opacity-50";
                  }
                  return (
                    <button
                      key={option.id}
                      disabled={isAnswered}
                      onClick={() => handleOptionClick(option.id)}
                      className={`w-full text-right p-4 rounded-xl border transition flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option.text}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pt-6">
                {!isAnswered ? (
                  <button
                    onClick={handleVerifyAnswer}
                    disabled={!selectedOptionId}
                    className="w-full py-3 bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition"
                  >
                    تحقق من الإجابة ✅
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl transition"
                  >
                    {currentQuestionIndex + 1 === lessonData.quizPool.length ? "إنهاء التحدي المبروك 🏁" : "الانتقال للسؤال التالي ➡️"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};