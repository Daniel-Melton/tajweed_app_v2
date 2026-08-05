import { prisma } from "@/lib/prisma";
import Link from "next/link";
type Skill = {
  id: string;
  title: string;
  slug: string;
  concept: string;
};
// 1. تأكد أن الدالة تبدأ بحرف كبير وتُصدر كـ default
export default async function SkillsPage() {
  // 2. جلب البيانات
  const skills = await prisma.skill.findMany();
console.log("البيانات اللي رجعت من قاعدة البيانات:", skills);
  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <h1 className="text-3xl font-bold text-emerald-900 mb-8">رحلة إتقان التجويد</h1>
      
      {skills.length === 0 ? (
        <div className="text-center py-20 text-gray-500">لا توجد أحكام مضافة حالياً.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill: Skill) => (
            <div key={skill.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-emerald-900 mb-2">{skill.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{skill.concept}</p>
              
              <div className="flex gap-3 mt-auto">
                <Link 
                  href={`/dashboard/skills/${skill.slug}`} 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700"
                >
                  شاهد الدرس
                </Link>
                <Link 
                  href={`/dashboard/quiz/${skill.slug}`} 
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold hover:bg-orange-200"
                >
                  اختبار سريع
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}