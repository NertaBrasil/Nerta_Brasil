"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminProfile } from "@/features/admin/users";
import { cn } from "@/shared/utils";
import { logout } from "../actions";

type SidebarProps = {
  profile: AdminProfile;
};

const NAV_LINKS = [
  { href: "/admin", label: "Início" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/destaques", label: "Destaques" },
];

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-navy-border bg-navy-mid p-6">
      <div>
        <h2 className="text-h4">Nerta Brasil</h2>
        <p className="mt-1 font-body text-sm text-muted-text">Painel administrativo</p>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/admin" ? pathname === link.href : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md border-l-[3px] px-3 py-2 font-body text-sm font-medium transition-colors duration-fast",
                  active
                    ? "border-l-nerta-blue bg-[rgba(30,127,200,0.12)] text-white"
                    : "border-l-transparent text-muted-text hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
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
