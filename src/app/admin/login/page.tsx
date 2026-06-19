import { redirect } from "next/navigation";
import { getCurrentAdminProfile, LoginForm } from "@/features/admin/auth";

export default async function AdminLoginPage() {
  const profile = await getCurrentAdminProfile();
  if (profile) redirect("/admin");

  return (
    <main className="grid min-h-screen md:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-gradient-to-br from-navy-deep to-navy-light p-14 md:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_100%_at_80%_12%,#5BB8F5_0,transparent_55%),radial-gradient(50%_90%_at_8%_92%,#1DB87E_0,transparent_55%)] opacity-[0.06]" />

        <img src="/nerta-logo-dark.svg" alt="Nerta" className="relative h-9 w-auto" />

        <div className="relative max-w-[420px]">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-provisao-gold">
            Painel administrativo
          </span>
          <h1 className="mt-3.5 text-h1 leading-tight">Gestão de catálogo e produtos.</h1>
          <p className="mt-4 max-w-[360px] font-body text-sm leading-body text-muted-text">
            Área restrita. Apenas administradores autenticados podem editar produtos, estoque e
            destaques da vitrine.
          </p>
        </div>

        <span className="relative font-body text-xs text-muted-text">
          Química automotiva premium · Uso interno
        </span>
      </section>

      <section className="flex items-center justify-center bg-navy-deeper px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-h3">Entrar</h2>
          <p className="mt-1.5 font-body text-sm text-muted-text">
            Acesse o painel com suas credenciais.
          </p>

          <div className="mt-7">
            <LoginForm />
          </div>

          <p className="mt-5 text-center font-body text-[11.5px] text-muted-text">
            Protegido por Supabase Auth · uso interno
          </p>
        </div>
      </section>
    </main>
  );
}
