import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuranExampleAdmin from "@/components/admin/QuranExampleAdmin";

export default async function QuranExamplesAdminPage({
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

  const examples = await prisma.quranExample.findMany({
    orderBy: [{ skillId: "asc" }, { order: "asc" }],
  });

  return (
    <QuranExampleAdmin
      skills={skills}
      initialExamples={examples}
      initialSkillId={skillId}
    />
  );
}
