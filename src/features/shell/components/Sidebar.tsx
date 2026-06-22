import Link from "next/link";
import type { AdminProfile } from "@/features/admin/users";
import { logout } from "../actions";

type SidebarProps = {
  profile: AdminProfile;
};

export function Sidebar({ profile }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-navy-border bg-navy-mid p-6">
      <div>
        <h2 className="text-h4">Nerta Brasil</h2>
        <p className="mt-1 font-body text-sm text-muted-text">Painel administrativo</p>

        {profile.role === "admin" && (
          <nav className="mt-6 flex flex-col gap-1">
            <Link
              href="/admin/usuarios"
              className="rounded-md border-l-[3px] border-l-transparent px-3 py-2 font-body text-sm font-medium text-muted-text transition-colors duration-fast hover:text-white"
            >
              Usuários
            </Link>
          </nav>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-navy-border pt-4">
        <div>
          <p className="font-body text-sm text-white">{profile.name}</p>
          <p className="font-body text-xs text-muted-text">{profile.email}</p>
        </div>
        <form action={logout}>
          <button type="submit" className="font-body text-sm text-sky-blue hover:underline">
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
