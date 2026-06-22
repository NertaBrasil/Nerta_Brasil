import { describe, expect, it } from "vitest";

const { isValidCpf, isValidCnpj } = await import("./document-validation");

describe("isValidCpf", () => {
  it("aceita um CPF válido", () => {
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("aceita um CPF válido formatado com pontuação", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
  });

  it("rejeita um CPF com dígito verificador incorreto", () => {
    expect(isValidCpf("52998224700")).toBe(false);
  });

  it("rejeita um CPF com todos os dígitos repetidos", () => {
    expect(isValidCpf("11111111111")).toBe(false);
  });

  it("rejeita um CPF com tamanho incorreto", () => {
    expect(isValidCpf("123456789")).toBe(false);
  });

  it("rejeita string vazia", () => {
    expect(isValidCpf("")).toBe(false);
  });
});

describe("isValidCnpj", () => {
  it("aceita um CNPJ válido", () => {
    expect(isValidCnpj("11222333000181")).toBe(true);
  });

  it("aceita um CNPJ válido formatado com pontuação", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
  });

  it("rejeita um CNPJ com dígito verificador incorreto", () => {
    expect(isValidCnpj("11222333000100")).toBe(false);
  });

  it("rejeita um CNPJ com todos os dígitos repetidos", () => {
    expect(isValidCnpj("11111111111111")).toBe(false);
  });

  it("rejeita um CNPJ com tamanho incorreto", () => {
    expect(isValidCnpj("1122233300")).toBe(false);
  });

  it("rejeita string vazia", () => {
    expect(isValidCnpj("")).toBe(false);
  });
});
