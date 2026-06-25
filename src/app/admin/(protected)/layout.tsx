import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import { AdminShell } from "@/features/shell";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentAdminProfile();
  if (!profile) redirect("/admin/login");

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
