"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markSkillAsCompleted(skillId: string, userId: string) {
  // تحديث أو إنشاء سجل تقدم المستخدم بناءً على الـ userId المرسل من الصفحة
  if (!userId) throw new Error("يجب تحديد المستخدم");
  await prisma.userProgress.upsert({
    where: {
      userId_skillId: {
        userId: userId,
        skillId: skillId,
      },
    },
    update: { isCompleted: true },
    create: {
      userId: userId,
      skillId: skillId,
      isCompleted: true,
    },
  });

  revalidatePath("/dashboard");
}

export async function getUserProgress(userId: string) {
  const progress = await prisma.userProgress.findMany({
    where: { userId: userId },
  });
  return progress;
}