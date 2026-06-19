import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import { Sidebar } from "@/features/shell";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentAdminProfile();
  if (!profile) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-navy-deep">
      <Sidebar profile={profile} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
