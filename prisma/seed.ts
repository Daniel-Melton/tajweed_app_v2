import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const dummySkills = [
  { title: "الإظهار الحلقي", slug: "izhar-halqi", concept: "إخراج النون الساكنة أو التنوين من مخرجها بوضوح إذا جاء بعدها أحد حروف الحلق الستة (ء، هـ، ع، ح، غ، خ).", order: 1 },
  { title: "الإدغام بغنة", slug: "idgham-bighunnah", concept: "إدخال النون الساكنة أو التنوين في حرف من حروف (ينمو) بحيث يصيران حرفاً واحداً مشدداً مع الغنة.", order: 2 },
  { title: "الإدغام بغير غنة", slug: "idgham-bila-ghunnah", concept: "إدخال النون الساكنة أو التنوين في حرف اللام أو الراء دون غنة.", order: 3 },
  { title: "الإقلاب", slug: "iqlab", concept: "قلب النون الساكنة أو التنوين ميماً خالصة إذا جاء بعدها حرف الباء، مع إخفائها بغنة.", order: 4 },
  { title: "الإخفاء الحقيقي", slug: "ikhfa-haqiqi", concept: "نطق النون الساكنة أو التنوين بحالة بين الإظهار والإدغام مع بقاء الغنة عند حروف الإخفاء الـ 15.", order: 5 },
  { title: "الإظهار الشفوي", slug: "izhar-shafawi", concept: "إظهار الميم الساكنة إذا جاء بعدها أي حرف عدا الباء والميم، مع الحذر عند الواو والفاء.", order: 6 },
  { title: "الإدغام الشفوي", slug: "idgham-shafawi", concept: "إدغام الميم الساكنة في الميم المتحركة التي بعدها بحيث يصيران ميماً واحدة مشددة مع الغنة.", order: 7 },
  { title: "الإخفاء الشفوي", slug: "ikhfa-shafawi", concept: "إخفاء الميم الساكنة عند الباء مع بقاء الغنة بمقدار حركتين.", order: 8 },
  { title: "المد الطبيعي", slug: "madd-tabeei", concept: "إطالة الصوت بحرف من حروف المد الثلاثة (ا، و، ي) بمقدار حركتين دون زيادة أو نقصان.", order: 9 },
  { title: "المد المتصل", slug: "madd-muttasil", concept: "أن يأتي حرف المد وبعده همزة في كلمة واحدة، ويمد بمقدار 4 أو 5 حركات وجوباً.", order: 10 },
  { title: "المد المنفصل", slug: "madd-munfasil", concept: "أن يأتي حرف المد في نهاية كلمة والهمزة في بداية الكلمة التي تليها، ويمد 4 أو 5 حركات جوازاً.", order: 11 },
  { title: "القلقلة", slug: "qalqalah", concept: "اهتزاز المخرج عند النطق بالحرف الساكن من حروف (قطب جد) حتى يُسمع له نبرة قوية.", order: 12 },
  { title: "مخارج الحروف", slug: "makhaarij", concept: "محل خروج الحرف وتميزه بصمته عن غيره، والمخارج الرئيسية: الجوف، الحلق، اللسان، الشفتان، الخيشوم.", order: 13 },
  { title: "صفات الحروف", slug: "sifaat", concept: "الهيئة التي يظهر بها الحرف، كالجهر والهمس والشدة والرخاوة والاستعلاء والاستفال.", order: 14 },
];

async function main() {
  console.log("🌱 جاري تجهيز البيانات...");

  // التأكد من وجود مستخدم أدمن
  let admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });

  if (!admin) {
    console.log("👤 لم يتم العثور على أدمن، جاري إنشاء أدمن تجريبي...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    admin = await prisma.user.create({
      data: {
        name: "المشرف",
        email: "admin@tajweed.com",
        phoneNumber: "01000000000",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ تم إنشاء الأدمن: admin@tajweed.com / admin123");
  } else {
    console.log("✅ تم العثور على أدمن: " + admin.email);
  }

  // إضافة أو تحديث المهارات
  for (const skill of dummySkills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {
        title: skill.title,
        concept: skill.concept,
        order: skill.order,
        createdBy: { connect: { id: admin!.id } },
      },
      create: {
        title: skill.title,
        slug: skill.slug,
        concept: skill.concept,
        order: skill.order,
        createdBy: { connect: { id: admin!.id } },
      },
    });
    console.log(`  ✅ ${skill.title}`);
  }

  // أمثلة قرآنية توضيحية (تلوين المقاطع اللي فيها الحكم) — مبدئيًا لأول درسين كمثال شغّال
  // ملحوظة: راجع دقة النص والتشكيل بنفسك قبل النشر الفعلي للطلاب.
  const quranExamplesBySkillSlug: Record<
    string,
    { surahName: string; surahNumber: number; ayahNumber: number; verseText: string; highlights: string[]; order: number }[]
  > = {
    "izhar-halqi": [
      {
        surahName: "سورة قريش",
        surahNumber: 106,
        ayahNumber: 4,
        verseText: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ",
        highlights: ["مِنْ خَوْفٍ"],
        order: 1,
      },
    ],
    "idgham-bighunnah": [
      {
        surahName: "سورة البقرة",
        surahNumber: 2,
        ayahNumber: 8,
        verseText: "وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ",
        highlights: ["مَن يَقُولُ"],
        order: 1,
      },
    ],
  };

  for (const [skillSlug, examples] of Object.entries(quranExamplesBySkillSlug)) {
    const skill = await prisma.skill.findUnique({ where: { slug: skillSlug } });
    if (!skill) continue;
    // نمسح القديم ونعيد الإدراج عشان الـ seed يفضل idempotent
    await prisma.quranExample.deleteMany({ where: { skillId: skill.id } });
    await prisma.quranExample.createMany({
      data: examples.map((e) => ({ ...e, skillId: skill.id })),
    });
    console.log(`  📖 أمثلة قرآنية لدرس: ${skill.title}`);
  }

  // أسئلة تمارين توضيحية (مبدئيًا لأول درسين كمثال شغّال)
  const questionsBySkillSlug: Record<
    string,
    { questionText: string; options: string[]; correctAnswer: string; points: number }[]
  > = {
    "izhar-halqi": [
      {
        questionText: "كم عدد حروف الإظهار الحلقي؟",
        options: ["4 حروف", "6 حروف", "8 حروف", "15 حرف"],
        correctAnswer: "6 حروف",
        points: 1,
      },
      {
        questionText: "أي الكلمات التالية فيها إظهار حلقي؟",
        options: ["مِنْ خَوْفٍ", "مَن يَقُولُ", "مِن بَعْدِ", "مِن مَّالٍ"],
        correctAnswer: "مِنْ خَوْفٍ",
        points: 1,
      },
    ],
    "idgham-bighunnah": [
      {
        questionText: "حروف الإدغام بغنة مجموعة في كلمة:",
        options: ["ينمو", "قلو", "بجهد", "أحكم"],
        correctAnswer: "ينمو",
        points: 1,
      },
      {
        questionText: "أي الكلمات التالية فيها إدغام بغنة؟",
        options: ["مَن يَقُولُ", "مِنْ خَوْفٍ", "أَنْعَمْتَ", "الْحَمْدُ"],
        correctAnswer: "مَن يَقُولُ",
        points: 1,
      },
    ],
  };

  for (const [skillSlug, qs] of Object.entries(questionsBySkillSlug)) {
    const skill = await prisma.skill.findUnique({ where: { slug: skillSlug } });
    if (!skill) continue;
    await prisma.question.deleteMany({ where: { skillId: skill.id } });
    await prisma.question.createMany({
      data: qs.map((q) => ({
        skillId: skill.id,
        text: q.questionText,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
      })),
    });
    console.log(`  📝 أسئلة تمارين لدرس: ${skill.title}`);
  }

  // إنشاء طالبة تجريبية مع تقدم في بعض الدروس
  let student = await prisma.user.findFirst({ where: { email: "student@test.com" } });
  if (!student) {
    const hashedPassword = await bcrypt.hash("student123", 10);
    student = await prisma.user.create({
      data: {
        name: "طالبة تجريبية",
        email: "student@test.com",
        phoneNumber: "01000000001",
        password: hashedPassword,
        role: "STUDENT",
      },
    });
    console.log("👩‍🎓 تم إنشاء طالبة تجريبية: student@test.com / student123");

    // إكمال أول 3 دروس للطالبة التجريبية
    const completedSlugs = ["izhar-halqi", "idgham-bighunnah", "idgham-bila-ghunnah"];
    for (const slug of completedSlugs) {
      const skill = await prisma.skill.findUnique({ where: { slug } });
      if (skill) {
        await prisma.userProgress.upsert({
          where: { userId_skillId: { userId: student.id, skillId: skill.id } },
          update: { isCompleted: true },
          create: { userId: student.id, skillId: skill.id, isCompleted: true },
        });
      }
    }
    console.log("📚 تم إكمال 3 دروس للطالبة التجريبية");
  }

  console.log("🎉 تم تجهيز جميع البيانات بنجاح!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
