"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext-old";
import { skillsDetailsBank } from "@/data/mockData";

// 🎵 توليد مؤثرات صوتية برمجياً فوراً بدون ملفات خارجيّة
const playSound = (type: "correct" | "wrong" | "victory") => {
  if (typeof window === "undefined") return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === "correct") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); 
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (type === "wrong") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (type === "victory") {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.08, ctx.currentTime + index * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.4);
      o.start(ctx.currentTime + index * 0.1);
      o.stop(ctx.currentTime + index * 0.1 + 0.4);
    });
  }
};

export default function QuizSection({ onClose }: { onClose: () => void }) {
  const { activeSkillKey, completeSkill, setActiveSkillKey } = useProgress();
  
  const skillInfo = activeSkillKey ? skillsDetailsBank[activeSkillKey] : null;
  const allQuestions = skillInfo?.quizPool || [];

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (allQuestions.length > 0) {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      setQuizQuestions(shuffled.slice(0, 5));
      setCurrentIndex(0);
      setScore(0);
      setQuizComplete(false);
      setIsAnswered(false);
      setSelectedOptionId(null);
      setTimeLeft(15);
    }
  }, [activeSkillKey]);

  useEffect(() => {
    if (quizComplete || isAnswered || quizQuestions.length === 0) return;

    if (timeLeft === 0) {
      handleOptionClick("");
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered, quizComplete, quizQuestions]);

  if (!activeSkillKey || !skillInfo || quizQuestions.length === 0) return null;

  const currentQuestion = quizQuestions[currentIndex];

  const handleOptionClick = (optionId: string) => {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const correctOption = currentQuestion.options.find((o: any) => o.isCorrect);
    if (optionId === correctOption?.id) {
      setScore((prev) => prev + 1);
      playSound("correct");
    } else {
      playSound("wrong");
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setQuizComplete(true);
      playSound("victory");
    }
  };

  const handleFinishQuiz = () => {
    let starsEarned = 1;
    if (score === 5) starsEarned = 3;
    else if (score >= 3) starsEarned = 2;

    completeSkill(activeSkillKey, starsEarned);
    setActiveSkillKey(null); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right" style={{ direction: 'rtl' }}>
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-800 dark:text-amber-400">
            اختبار حكم: {skillInfo.title}
          </h3>
          <button 
            onClick={() => {
              setActiveSkillKey(null);
              onClose(); 
            }}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {!quizComplete ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              <span>السؤال {currentIndex + 1} من {quizQuestions.length}</span>
              <span className={`flex items-center gap-1 font-mono px-2 py-0.5 rounded ${timeLeft <= 5 ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 animate-pulse" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"}`}>
                ⏱️ {timeLeft} ثانية
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-l from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            <h4 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
              {currentQuestion.question}
            </h4>

            <div className="mt-6 flex flex-col gap-3">
              {currentQuestion.options.map((option: any) => {
                let btnStyles = "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300";
                
                if (isAnswered) {
                  if (option.isCorrect) {
                    btnStyles = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold";
                  } else if (selectedOptionId === option.id) {
                    btnStyles = "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400";
                  } else {
                    btnStyles = "border-slate-100 dark:border-slate-800 opacity-60 text-slate-400";
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(option.id)}
                    className={`w-full rounded-xl border-2 p-4 text-right text-base transition-all flex items-center justify-between ${btnStyles}`}
                  >
                    <span>{option.text}</span>
                    {isAnswered && option.isCorrect && <span>✓</span>}
                    {isAnswered && selectedOptionId === option.id && !option.isCorrect && <span>✕</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                disabled={!isAnswered}
                onClick={handleNext}
                className={`rounded-xl px-6 py-3 font-bold text-white shadow-md transition-all ${isAnswered ? "bg-amber-500 hover:bg-amber-600 scale-100" : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed scale-95"}`}
              >
                {currentIndex + 1 === quizQuestions.length ? "عرض النتيجة" : "السؤال التالي ←"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center animate-scale-up">
            <div className="text-6xl mb-2">
              {score === 5 ? "👑" : score >= 3 ? "🌟" : "👍"}
            </div>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-white">
              {score === 5 ? "أحسنت! إتقان تام" : score >= 3 ? "نجاح ممتاز" : "حاول مرة أخرى لتنال النجوم كالمحترفين!"}
            </h4>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              لقد أجبت بشكل صحيح على <span className="font-bold text-amber-500 text-lg">{score}</span> من أصل {quizQuestions.length} أسئلة.
            </p>

            <div className="my-6 flex justify-center gap-2 text-4xl">
              <span className={score >= 1 ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}>★</span>
              <span className={score >= 3 ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}>★</span>
              <span className={score === 5 ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}>★</span>
            </div>

            <button
              onClick={handleFinishQuiz}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 font-bold text-white shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-[1.02]"
            >
              حفظ النتيجة والعودة للرحلة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}