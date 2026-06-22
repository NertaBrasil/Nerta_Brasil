import { describe, expect, it } from "vitest";

const { createUserSchema } = await import("./schemas");

const VALID_INPUT = {
  name: "Editora Teste",
  email: "editora@nerta.com.br",
  password: "senha-segura-123",
  role: "editor" as const,
};

describe("createUserSchema", () => {
  it("aceita um input válido", () => {
    const result = createUserSchema.safeParse(VALID_INPUT);
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail com formato inválido", () => {
    const result = createUserSchema.safeParse({ ...VALID_INPUT, email: "nao-e-email" });
    expect(result.success).toBe(false);
  });

  it("rejeita senha menor que o tamanho mínimo", () => {
    const result = createUserSchema.safeParse({ ...VALID_INPUT, password: "123" });
    expect(result.success).toBe(false);
  });

  it("rejeita papel fora de admin/editor", () => {
    const result = createUserSchema.safeParse({ ...VALID_INPUT, role: "superadmin" });
    expect(result.success).toBe(false);
  });

  it("rejeita nome vazio", () => {
    const result = createUserSchema.safeParse({ ...VALID_INPUT, name: "" });
    expect(result.success).toBe(false);
  });
});
