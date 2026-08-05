import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = session.user.name || "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      {/* خلفية ناعمة */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="text-6xl mb-6">🌱</div>

        <p className="text-emerald-300/80 text-lg md:text-xl mb-3">أهلاً بك يا</p>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-wide">
          {name}
        </h1>

        <div className="w-24 h-1 bg-emerald-500 rounded-full mx-auto mb-6" />

        <p className="text-gray-300/90 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
          أهلاً بك في رحلة إتقان أحكام التجويد معنا 🌿
          استعد لتعلّم أحكام التلاوة خطوة بخطوة واجمع النجوم في كل درس.
        </p>

        <Link
          href="/dashboard"
          className="inline-block px-10 py-4 bg-emerald-600 text-white text-lg md:text-xl font-bold rounded-full hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(5,200,100,0.35)]"
        >
          ابدأ رحلتك معنا
        </Link>

        <p className="text-gray-500 text-sm mt-8">بالتوفيق في رحلتك القرآنية 🍃</p>
      </div>
    </div>
  );
}
