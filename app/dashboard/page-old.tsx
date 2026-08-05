import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth"; // عشان نعرف مين الطالب اللي مسجل
import { getUserProgress } from "@/lib/actions"; // استدعاء الوظيفة الجديدة
import { authOptions } from "@/lib/auth";
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  // لو مفيش جلسة، ممكن ترجع null أو redirect
  if (!session?.user?.id) {
    return <div>الرجاء تسجيل الدخول</div>;
  }
  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
  const progress = await getUserProgress(session.user.id);
  // بنجيب تقدم الطالب الحالي
  // const progress = await prisma.userProgress.findMany({
  //   where: { userId: session?.user?.id } // ده افتراض لاسم حقل الـ ID عندك
  // });

  return (
    <div className="min-h-screen bg-gray-950 p-8" dir="rtl">
      <h1 className="text-4xl font-extrabold text-white mb-16 text-center">رحلة إتقان التجويد</h1>
      
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute right-[50%] top-0 bottom-0 w-1 bg-emerald-900/50 -mr-0.5"></div>

        {skills.map((skill: any, index: number) => {
          // اللوجيك بتاع القفل: الدرس الأول مفتوح دائماً، الباقي يعتمد على اللي قبله
          const isCompleted = progress.find((p: any) => p.skillId === skill.id)?.isCompleted;
          const isLocked = index > 0 && !progress.find((p: any) => p.skillId === skills[index - 1].id)?.isCompleted;
          return (
            <div key={skill.id} className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              
              {/* الدائرة */}
              <div className={`absolute right-[50%] -mr-6 w-12 h-12 rounded-full border-4 border-gray-950 flex items-center justify-center font-bold shadow-lg z-10 
                ${isLocked ? 'bg-gray-700 text-gray-400' : 'bg-emerald-600 text-white shadow-emerald-900'}`}>
                {index + 1}
              </div>
              
              {/* الكارت (هنا مكان إضافة الـ class بتاع القفل) */}
              <div className={`w-[45%] p-6 bg-gray-900 rounded-2xl border transition-all 
                ${isLocked ? 'opacity-50 pointer-events-none grayscale border-gray-800' : 'border-emerald-900/30 hover:border-emerald-500'} 
                ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                
                <h2 className={`text-xl font-bold ${isLocked ? 'text-gray-500' : 'text-emerald-400'}`}>
                  {skill.title}
                </h2>
                
                {isLocked ? (
                  <p className="text-gray-500 mt-2 text-sm">يجب إتمام الدرس السابق أولاً</p>
                ) : (
                  <>
                    <p className="text-gray-400 mt-2 text-sm">{skill.concept?.substring(0, 60)}...</p>
                    <Link href={`/dashboard/skills/${skill.slug}`} className="mt-4 block text-emerald-500 font-bold hover:text-emerald-300">
                      ابدأ الدرس ←
                    </Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}