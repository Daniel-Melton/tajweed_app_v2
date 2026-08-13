import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-emerald-800 mb-8">مرحباً بك في أكاديمية التجويد</h1>
      <p className="text-gray-600 mb-10 text-lg">الرجاء اختيار الدخول للمنصة أو إنشاء حساب جديد</p>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link 
          href="/login?as=student" 
          className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          تسجيل الدخول كطالب
        </Link>
        <Link 
          href="/login?as=admin" 
          className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
        >
          تسجيل الدخول كأدمن
        </Link>
        <Link 
          href="/register" 
          className="w-full py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition"
        >
          إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
}