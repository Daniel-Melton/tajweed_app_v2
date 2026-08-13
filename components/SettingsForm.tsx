"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateProfileName, changePassword } from "@/lib/actions";
import LogoutButton from "@/components/LogoutButton";

interface Props {
  currentName: string;
  email: string | null;
  phoneNumber: string | null;
}

export default function SettingsForm({ currentName, email, phoneNumber }: Props) {
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(currentName);
  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  function handleSaveName() {
    setNameError(null);
    setNameMsg(null);
    startTransition(async () => {
      try {
        await updateProfileName(name);
        setNameMsg("تم حفظ الاسم بنجاح");
      } catch (e) {
        setNameError(e instanceof Error ? e.message : "حصل خطأ");
      }
    });
  }

  function handleChangePassword() {
    setPwError(null);
    setPwMsg(null);
    if (newPassword !== confirmPassword) {
      setPwError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }
    startTransition(async () => {
      try {
        await changePassword(currentPassword, newPassword);
        setPwMsg("تم تغيير كلمة المرور بنجاح");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (e) {
        setPwError(e instanceof Error ? e.message : "حصل خطأ");
      }
    });
  }

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-950 text-emerald-950 dark:text-white transition-colors" dir="rtl">
      <header className="border-b border-emerald-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur sticky top-0 z-10 transition-colors">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-800 flex items-center justify-center text-emerald-700 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-white hover:border-emerald-600 transition-colors"
            aria-label="العودة لرحلة الشجرة"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
          <h1 className="text-lg md:text-xl font-extrabold text-emerald-950 dark:text-white">الإعدادات</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* الاسم */}
        <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-6 space-y-4 transition-colors">
          <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">البيانات الشخصية</h2>

          <div>
            <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">الاسم</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
            />
          </div>

          {(email || phoneNumber) && (
            <div className="text-sm text-emerald-700/60 dark:text-gray-500">
              {email && <p>البريد الإلكتروني: {email}</p>}
              {phoneNumber && <p>رقم الهاتف: {phoneNumber}</p>}
            </div>
          )}

          {nameError && <p className="text-red-500 dark:text-red-400 text-sm">{nameError}</p>}
          {nameMsg && <p className="text-emerald-600 dark:text-emerald-400 text-sm">{nameMsg}</p>}

          <button
            type="button"
            onClick={handleSaveName}
            disabled={isPending || !name.trim() || name === currentName}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors"
          >
            حفظ الاسم
          </button>
        </div>

        {/* كلمة المرور */}
        <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl p-6 space-y-4 transition-colors">
          <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">تغيير كلمة المرور</h2>

          <div>
            <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">كلمة المرور الحالية</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-sm text-emerald-700/70 dark:text-gray-400 mb-2">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-gray-950 border border-emerald-200 dark:border-gray-800 text-emerald-950 dark:text-white outline-none focus:border-emerald-600"
            />
          </div>

          {pwError && <p className="text-red-500 dark:text-red-400 text-sm">{pwError}</p>}
          {pwMsg && <p className="text-emerald-600 dark:text-emerald-400 text-sm">{pwMsg}</p>}

          <button
            type="button"
            onClick={handleChangePassword}
            disabled={isPending || !currentPassword || !newPassword || !confirmPassword}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors"
          >
            تغيير كلمة المرور
          </button>
        </div>

        <div className="pt-2">
          <LogoutButton variant="full" />
        </div>
      </main>
    </div>
  );
}
