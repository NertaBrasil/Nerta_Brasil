import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminShell } from "./AdminShell";
import type { AdminProfile } from "@/features/admin/users";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/produtos",
}));

const profile: AdminProfile = {
  id: "admin-1",
  name: "Dev Admin",
  role: "admin",
  email: "admin@nerta.com.br",
  created_at: "2026-01-01T00:00:00Z",
};

describe("AdminShell", () => {
  it("menu mobile fica fechado por padrão e abre ao clicar no botão hambúrguer", async () => {
    render(
      <AdminShell profile={profile}>
        <p>Conteúdo</p>
      </AdminShell>
    );

    expect(screen.queryByLabelText("Fechar menu")).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText("Abrir menu"));

    expect(screen.getByLabelText("Fechar menu")).toBeInTheDocument();
  });

  it("fecha o menu mobile ao navegar para um link da sidebar", async () => {
    render(
      <AdminShell profile={profile}>
        <p>Conteúdo</p>
      </AdminShell>
    );

    await userEvent.click(screen.getByLabelText("Abrir menu"));
    expect(screen.getByLabelText("Fechar menu")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("link", { name: "Produtos" }));

    expect(screen.queryByLabelText("Fechar menu")).not.toBeInTheDocument();
  });
});
