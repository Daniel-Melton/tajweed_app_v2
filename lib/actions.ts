"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

/** بتحدّث اسم المستخدم الحالي */
export async function updateProfileName(newName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("لازم تكون مسجّل دخول");
  if (!newName.trim()) throw new Error("الاسم مايقدرش يكون فاضي");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: newName.trim() },
  });
  revalidatePath("/dashboard/settings");
}

/** بتغيّر كلمة مرور المستخدم الحالي بعد التأكد من كلمة المرور القديمة */
export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("لازم تكون مسجّل دخول");
  if (newPassword.length < 6) throw new Error("كلمة المرور الجديدة لازم تكون 6 حروف/أرقام على الأقل");

  const bcrypt = (await import("bcryptjs")).default;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("المستخدم غير موجود");

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new Error("كلمة المرور الحالية غير صحيحة");

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });
}
export async function saveTestResult(data: {
  userId: string;
  skillSlug: string;
  skillTitle: string;
  score: number;
  totalQuestions: number;
}) {
  const isPassed = data.totalQuestions > 0 && data.score / data.totalQuestions >= 0.6;
  await prisma.testResult.create({
    data: {
      userId: data.userId,
      skillSlug: data.skillSlug,
      skillTitle: data.skillTitle,
      score: data.score,
      totalQuestions: data.totalQuestions,
      isPassed,
    },
  });
  revalidatePath("/dashboard/analytics");
}

/** تتأكد إن اللي بينده الأكشن أدمن فعلاً — دفاع إضافي حتى لو الصفحة نفسها محمية */
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  // @ts-ignore role مضافة يدويًا في next-auth callbacks
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("غير مصرح لك بهذا الإجراء");
  }
}

export async function addQuranExample(data: {
  skillId: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  verseText: string;
  highlights: string[];
}) {
  await requireAdmin();

  if (!data.skillId || !data.surahName.trim() || !data.verseText.trim() || !data.surahNumber) {
    throw new Error("الرجاء ملء كل الحقول المطلوبة");
  }

  const maxOrder = await prisma.quranExample.aggregate({
    where: { skillId: data.skillId },
    _max: { order: true },
  });

  await prisma.quranExample.create({
    data: {
      skillId: data.skillId,
      surahName: data.surahName.trim(),
      surahNumber: data.surahNumber,
      ayahNumber: data.ayahNumber,
      verseText: data.verseText.trim(),
      highlights: data.highlights,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  revalidatePath("/dashboard/admin/quran-examples");
  revalidatePath("/dashboard/skills");
}

export async function deleteQuranExample(id: string) {
  await requireAdmin();
  await prisma.quranExample.delete({ where: { id } });
  revalidatePath("/dashboard/admin/quran-examples");
  revalidatePath("/dashboard/skills");
}

export async function updateQuranExample(
  id: string,
  data: {
    surahName: string;
    surahNumber: number;
    ayahNumber: number;
    verseText: string;
    highlights: string[];
  }
) {
  await requireAdmin();

  if (!data.surahName.trim() || !data.verseText.trim() || !data.surahNumber) {
    throw new Error("الرجاء ملء كل الحقول المطلوبة");
  }

  await prisma.quranExample.update({
    where: { id },
    data: {
      surahName: data.surahName.trim(),
      surahNumber: data.surahNumber,
      ayahNumber: data.ayahNumber,
      verseText: data.verseText.trim(),
      highlights: data.highlights,
      // لو النص أو الآية اتغيرت، الصوت المحمّل قديم بقى غير مطابق — بنصفّره عشان يترفع تاني
      audioHusaryPath: null,
      audioMinshawiPath: null,
    },
  });

  revalidatePath("/dashboard/admin/quran-examples");
  revalidatePath("/dashboard/skills");
}

/** أسئلة التمارين التفاعلية لكل درس */
export async function addQuestion(data: {
  skillId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  points?: number;
}) {
  await requireAdmin();

  if (!data.skillId || !data.questionText.trim() || data.options.length < 2 || !data.correctAnswer) {
    throw new Error("الرجاء ملء نص السؤال، خيارين على الأقل، وتحديد الإجابة الصحيحة");
  }
  if (!data.options.includes(data.correctAnswer)) {
    throw new Error("الإجابة الصحيحة لازم تكون واحدة من الخيارات المكتوبة");
  }

  await prisma.question.create({
    data: {
      skillId: data.skillId,
      text: data.questionText.trim(),
      questionText: data.questionText.trim(),
      options: data.options,
      correctAnswer: data.correctAnswer,
      points: data.points ?? 1,
    },
  });

  revalidatePath("/dashboard/admin/questions");
  revalidatePath("/dashboard/skills");
}

export async function deleteQuestion(id: string) {
  await requireAdmin();
  await prisma.question.delete({ where: { id } });
  revalidatePath("/dashboard/admin/questions");
  revalidatePath("/dashboard/skills");
}

export async function updateQuestion(
  id: string,
  data: {
    questionText: string;
    options: string[];
    correctAnswer: string;
    points?: number;
  }
) {
  await requireAdmin();

  if (!data.questionText.trim() || data.options.length < 2 || !data.correctAnswer) {
    throw new Error("الرجاء ملء نص السؤال، خيارين على الأقل، وتحديد الإجابة الصحيحة");
  }
  if (!data.options.includes(data.correctAnswer)) {
    throw new Error("الإجابة الصحيحة لازم تكون واحدة من الخيارات المكتوبة");
  }

  await prisma.question.update({
    where: { id },
    data: {
      text: data.questionText.trim(),
      questionText: data.questionText.trim(),
      options: data.options,
      correctAnswer: data.correctAnswer,
      points: data.points ?? 1,
    },
  });

  revalidatePath("/dashboard/admin/questions");
  revalidatePath("/dashboard/skills");
}

/** أكواد القارئين على alquran.cloud API */
const RECITER_EDITIONS = {
  husary: "ar.husary",
  minshawi: "ar.minshawi",
} as const;
export type ReciterKey = keyof typeof RECITER_EDITIONS;

/**
 * بيرجع رابط الصوت المباشر (live) لآية معيّنة من الـ API الخارجي —
 * يُستخدم كـ fallback وقت التشغيل لو الملف لسه مش متحمّل محليًا.
 */
export async function getLiveAyahAudioUrl(
  surahNumber: number,
  ayahNumber: number,
  reciter: ReciterKey
) {
  const edition = RECITER_EDITIONS[reciter];
  const res = await fetch(
    `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${edition}`,
    { next: { revalidate: 60 * 60 * 24 } }
  );
  if (!res.ok) throw new Error("تعذّر جلب رابط الصوت من الـ API");
  const json = await res.json();
  const url: string | undefined = json?.data?.audioSecondary?.[0] || json?.data?.audio;
  if (!url) throw new Error("الـ API مرجّعش رابط صوت لهذه الآية");
  return url;
}

/**
 * بتحمّل ملف الصوت فعليًا من الـ API وتحفظه داخل public/audio عشان يبقى
 * جزء دائم من المشروع (مش معتمد على توفر الـ API مستقبلًا)، وتحدّث
 * سجل الآية بمسار الملف المحلي.
 *
 * ⚠️ محلي فقط: الكتابة على نظام الملفات دي بتشتغل في التطوير المحلي أو
 * أي سيرفر Node تقليدي. على استضافات serverless (زي Vercel) نظام
 * الملفات وقت التشغيل عادة read-only/مؤقت، فالتحميل مش هيتحفظ بشكل دائم هناك.
 */
export async function downloadQuranAudio(exampleId: string, reciter: ReciterKey) {
  await requireAdmin();

  const example = await prisma.quranExample.findUnique({ where: { id: exampleId } });
  if (!example) throw new Error("المثال غير موجود");

  const liveUrl = await getLiveAyahAudioUrl(example.surahNumber, example.ayahNumber, reciter);

  const audioRes = await fetch(liveUrl);
  if (!audioRes.ok) throw new Error("تعذّر تحميل ملف الصوت");
  const arrayBuffer = await audioRes.arrayBuffer();

  const fs = await import("fs/promises");
  const path = await import("path");

  const dir = path.join(process.cwd(), "public", "audio", reciter);
  await fs.mkdir(dir, { recursive: true });

  const fileName = `${example.surahNumber}-${example.ayahNumber}.mp3`;
  const filePath = path.join(dir, fileName);
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  const publicPath = `/audio/${reciter}/${fileName}`;

  await prisma.quranExample.update({
    where: { id: exampleId },
    data:
      reciter === "husary"
        ? { audioHusaryPath: publicPath }
        : { audioMinshawiPath: publicPath },
  });

  revalidatePath("/dashboard/admin/quran-examples");
  revalidatePath("/dashboard/skills");

  return publicPath;
}