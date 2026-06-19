import { redirect } from "next/navigation";
import { getCurrentAdminProfile, LoginForm } from "@/features/admin/auth";

export default async function AdminLoginPage() {
  const profile = await getCurrentAdminProfile();
  if (profile) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-deep px-4">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div>
          <h1 className="text-h2">Nerta Brasil</h1>
          <p className="mt-1 font-body text-sm text-muted-text">Painel administrativo</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
