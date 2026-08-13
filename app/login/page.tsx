"use client";
import Link from "next/link"; // السطر ده هو اللي بيعرف الـ Link
import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const asAdmin = searchParams.get("as") === "admin";
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      identifier: formData.identifier,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setError("بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.");
      setLoading(false);
    } else {
      // بنوجّه حسب صلاحية الحساب الفعلية (مش حسب الزرار اللي اتضغط)
      const session = await getSession();
      // @ts-ignore role مضافة يدويًا في next-auth callbacks
      const isAdmin = session?.user?.role === "ADMIN";
      router.push(isAdmin ? "/dashboard/admin/quran-examples" : "/welcome");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dir-rtl" dir="rtl">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">
          {asAdmin ? "تسجيل دخول الأدمن" : "تسجيل الدخول"}
        </h2>
        
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني أو رقم الهاتف</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
        <div className="mt-4 text-center">
        <Link href="/" className="text-emerald-600 hover:underline text-sm">
    ← العودة للرئيسية
        </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}