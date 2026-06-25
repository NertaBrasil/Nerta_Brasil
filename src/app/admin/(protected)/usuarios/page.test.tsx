import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const redirectMock = vi.fn(() => {
  throw new Error("NEXT_REDIRECT");
});
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

const getCurrentAdminProfileMock = vi.fn();
vi.mock("@/features/admin/auth", () => ({
  getCurrentAdminProfile: getCurrentAdminProfileMock,
}));

vi.mock("@/features/admin/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/admin/users")>();
  return {
    ...actual,
    UserList: () => <div>Lista de usuários</div>,
    UserForm: () => <div>Formulário de usuário</div>,
  };
});

const { default: AdminUsersPage } = await import("./page");

describe("AdminUsersPage", () => {
  beforeEach(() => {
    redirectMock.mockClear();
    getCurrentAdminProfileMock.mockReset();
  });

  it("nega acesso (redirect) a um usuário com papel 'editor'", async () => {
    getCurrentAdminProfileMock.mockResolvedValue({
      id: "editor-1",
      name: "Editor",
      role: "editor",
      created_at: "2026-01-01T00:00:00Z",
      email: "editor@nerta.com.br",
    });

    await expect(AdminUsersPage()).rejects.toThrow("NEXT_REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/admin");
  });

  it("renderiza a página para um usuário com papel 'admin'", async () => {
    getCurrentAdminProfileMock.mockResolvedValue({
      id: "admin-1",
      name: "Admin",
      role: "admin",
      created_at: "2026-01-01T00:00:00Z",
      email: "admin@nerta.com.br",
    });

    const element = await AdminUsersPage();
    render(element);

    expect(screen.getByText("Lista de usuários")).toBeInTheDocument();
  });
});
