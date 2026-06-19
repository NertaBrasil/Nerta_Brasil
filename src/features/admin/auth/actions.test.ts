import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPasswordMock = vi.fn();

vi.mock("@/infrastructure/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signInWithPassword: signInWithPasswordMock },
  })),
}));

const { login } = await import("./actions");

const GENERIC_ERROR = "E-mail ou senha inválidos.";

describe("login", () => {
  beforeEach(() => {
    signInWithPasswordMock.mockReset();
  });

  it("retorna sucesso quando as credenciais são válidas", async () => {
    signInWithPasswordMock.mockResolvedValue({ data: { user: { id: "1" } }, error: null });

    const result = await login({ email: "admin@nerta.com.br", password: "senha-correta" });

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "admin@nerta.com.br",
      password: "senha-correta",
    });
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("retorna a mensagem genérica quando o usuário não existe", async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });

    const result = await login({ email: "inexistente@nerta.com.br", password: "qualquer" });

    expect(result).toEqual({ success: false, error: GENERIC_ERROR });
  });

  it("retorna a mesma mensagem genérica quando a senha está incorreta", async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });

    const result = await login({ email: "admin@nerta.com.br", password: "senha-errada" });

    expect(result).toEqual({ success: false, error: GENERIC_ERROR });
  });

  it("retorna a mensagem genérica para input inválido, sem chamar o Supabase", async () => {
    const result = await login({ email: "nao-e-email", password: "" });

    expect(signInWithPasswordMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: GENERIC_ERROR });
  });
});
