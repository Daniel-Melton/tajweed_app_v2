import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import CompleteButton from "@/components/CompleteButton";

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  
  // جلب الدرس
  const skill = await prisma.skill.findUnique({ where: { slug: slug } });

  // التحقق من وجود الدرس وجلسة المستخدم
  if (!skill || !session?.user?.id) notFound();

  // "السحر هنا": التحقق من قاعدة البيانات لمعرفة هل المستخدم أكمل هذا الدرس مسبقاً
  const progress = await prisma.userProgress.findUnique({
    where: {
      userId_skillId: {
        userId: session.user.id,
        skillId: skill.id,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-emerald-400 mb-8">{skill.title}</h1>
        
        {skill.videoUrl && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-8 border border-gray-800">
            <iframe 
              className="w-full h-full" 
              src={skill.videoUrl.replace("watch?v=", "embed/")} 
              title={skill.title} 
              allowFullScreen 
            />
          </div>
        )}

        {/* تمرير حالة الإكمال للزرار */}
        <CompleteButton 
          skillId={skill.id} 
          userId={session.user.id} 
          initialCompleted={!!progress?.isCompleted} 
        />

        <div className="bg-gray-900 p-8 rounded-3xl mt-8 shadow-lg border border-gray-800">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">شرح الحكم</h2>
          <div className="text-gray-300 leading-relaxed text-lg">{skill.concept}</div>
        </div>
      </div>
    </div>
  );
}