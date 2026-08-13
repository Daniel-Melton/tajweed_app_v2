import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuestionsAdmin from "@/components/admin/QuestionsAdmin";

export default async function QuestionsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ skillId?: string }>;
}) {
  const { skillId } = await searchParams;
  const session = await getServerSession(authOptions);

  // حماية: أدمن فقط
  // @ts-ignore role مضافة يدويًا في next-auth callbacks
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const skills = await prisma.skill.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true, order: true },
  });

  const questions = await prisma.question.findMany({
    orderBy: [{ skillId: "asc" }],
  });

  return (
    <QuestionsAdmin
      skills={skills}
      initialQuestions={questions.map((q) => ({
        id: q.id,
        skillId: q.skillId,
        questionText: q.questionText || q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
      }))}
      initialSkillId={skillId}
    />
  );
}
