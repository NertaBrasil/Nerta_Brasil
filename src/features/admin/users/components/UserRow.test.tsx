import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../actions", () => ({ deleteUser: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const { UserRow } = await import("./UserRow");

const USER = {
  id: "user-1",
  name: "Editor Teste",
  email: "editor@nerta.com.br",
  role: "editor" as const,
  created_at: "2026-01-01T00:00:00Z",
};

describe("UserRow", () => {
  it("exibe o botão de excluir para outro usuário", () => {
    render(
      <table>
        <tbody>
          <UserRow user={USER} currentUserId="admin-1" />
        </tbody>
      </table>
    );

    expect(screen.getByRole("button", { name: /excluir/i })).toBeInTheDocument();
  });

  it("não oferece a opção de excluir na própria linha do admin logado", () => {
    render(
      <table>
        <tbody>
          <UserRow user={USER} currentUserId="user-1" />
        </tbody>
      </table>
    );

    expect(screen.queryByRole("button", { name: /excluir/i })).not.toBeInTheDocument();
    expect(screen.getByText(/você/i)).toBeInTheDocument();
  });
});
