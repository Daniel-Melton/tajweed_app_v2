import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phoneNumber: true },
  });
  if (!user) redirect("/login");

  return <SettingsForm currentName={user.name} email={user.email} phoneNumber={user.phoneNumber} />;
}
