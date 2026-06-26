import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/features/admin/auth";

export default async function AdminHomePage() {
  const profile = await getCurrentAdminProfile();
  if (profile?.role === "partner_viewer") redirect("/admin/parcerias");

  return (
    <div>
      <h1 className="text-h2">Bem-vindo, {profile?.name}</h1>
      <p className="mt-2 font-body text-muted-text">Painel administrativo Nerta Brasil.</p>
    </div>
  );
}
