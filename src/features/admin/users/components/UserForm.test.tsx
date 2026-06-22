import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const createUserMock = vi.fn();
vi.mock("../actions", () => ({ createUser: createUserMock }));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const { UserForm } = await import("./UserForm");

describe("UserForm", () => {
  beforeEach(() => {
    createUserMock.mockReset();
    refreshMock.mockReset();
  });

  it("chama createUser com os dados preenchidos ao submeter", async () => {
    createUserMock.mockResolvedValue({
      success: true,
      data: {
        id: "new-1",
        name: "Nova Editora",
        email: "nova-editora@nerta.com.br",
        role: "editor",
        created_at: "2026-01-01T00:00:00Z",
      },
    });

    render(<UserForm />);

    await userEvent.type(screen.getByLabelText(/nome/i), "Nova Editora");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "nova-editora@nerta.com.br");
    await userEvent.type(screen.getByLabelText(/senha/i), "senha-segura-123");
    await userEvent.selectOptions(screen.getByLabelText(/papel/i), "editor");
    await userEvent.click(screen.getByRole("button", { name: /criar usuário/i }));

    expect(createUserMock).toHaveBeenCalledWith({
      name: "Nova Editora",
      email: "nova-editora@nerta.com.br",
      password: "senha-segura-123",
      role: "editor",
    });
    expect(refreshMock).toHaveBeenCalled();
  });

  it("exibe o erro de duplicidade retornado pela action", async () => {
    createUserMock.mockResolvedValue({
      success: false,
      error: "Já existe um usuário com esse e-mail.",
    });

    render(<UserForm />);

    await userEvent.type(screen.getByLabelText(/nome/i), "Duplicado");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "admin@nerta.com.br");
    await userEvent.type(screen.getByLabelText(/senha/i), "senha-segura-123");
    await userEvent.click(screen.getByRole("button", { name: /criar usuário/i }));

    expect(await screen.findByText(/já existe um usuário com esse e-mail/i)).toBeInTheDocument();
  });
});
