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
