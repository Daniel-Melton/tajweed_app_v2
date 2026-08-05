import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // حماية: لا تسمح إلا للـ ADMIN بإضافة أحكام
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "غير مصرح لك" }, { status: 403 });
  }

  try {
    const { title, concept, videoUrl, slug } = await req.json();
    
    const newSkill = await prisma.skill.create({
      data: {
        title,
        concept,
        videoUrl,
        slug,
        createdById: session.user.id,
        audioGuides: {}, // سنملأها لاحقاً
      },
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "خطأ في حفظ الحكم" }, { status: 500 });
  }
}