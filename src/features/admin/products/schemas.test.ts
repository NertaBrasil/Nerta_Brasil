import { describe, expect, it } from "vitest";

const { productSchema, updateProductSchema } = await import("./schemas");

const BASE_INPUT = {
  name: "Truck Clean",
  slug: "linha-frotas-truck-clean",
  line: "Linha Frotas",
  category_id: "cat-1",
  dilution: "3-5%",
  attributes: ["Touchless"],
  short_description: "Resumo",
  description: "Descrição completa",
  stock: 10,
  active: true,
};

describe("productSchema — purchase_mode / ml_url condicional", () => {
  it("exige ml_url quando purchase_mode = 'mercado_livre'", () => {
    const result = productSchema.safeParse({
      ...BASE_INPUT,
      purchase_mode: "mercado_livre",
      ml_url: null,
    });

    expect(result.success).toBe(false);
  });

  it("aceita ml_url ausente quando purchase_mode = 'formulario_parceria'", () => {
    const result = productSchema.safeParse({
      ...BASE_INPUT,
      purchase_mode: "formulario_parceria",
      ml_url: null,
    });

    expect(result.success).toBe(true);
  });

  it("aceita quando purchase_mode = 'mercado_livre' e ml_url está preenchido", () => {
    const result = productSchema.safeParse({
      ...BASE_INPUT,
      purchase_mode: "mercado_livre",
      ml_url: "https://produto.mercadolivre.com.br/1",
    });

    expect(result.success).toBe(true);
  });

  it("assume 'mercado_livre' como padrão quando purchase_mode não é informado", () => {
    const result = productSchema.safeParse({
      ...BASE_INPUT,
      ml_url: "https://produto.mercadolivre.com.br/1",
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.purchase_mode).toBe("mercado_livre");
  });

  it("updateProductSchema aplica a mesma regra condicional", () => {
    const result = updateProductSchema.safeParse({
      ...BASE_INPUT,
      id: "prod-1",
      purchase_mode: "mercado_livre",
      ml_url: null,
    });

    expect(result.success).toBe(false);
  });
});
