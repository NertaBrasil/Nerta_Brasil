import { describe, expect, it } from "vitest";

const { partnerApplicationSchema } = await import("./schemas");

const VALID_CNPJ = "11222333000181";
const VALID_CPF = "52998224725";

const BASE_PJ_INPUT = {
  product_id: "prod-1",
  document_type: "cnpj" as const,
  document_number: VALID_CNPJ,
  legal_name: "Transportes Exemplo Ltda",
  trade_name: "Exemplo Transportes",
  city: "São Paulo",
  state: "SP",
  website: null,
  contact_name: "Maria Silva",
  contact_role: "Gerente de Compras",
  phone: "+55 11 99999-0000",
  email: "maria@exemplo.com.br",
  linkedin_url: null,
  relationship_interest: "distribuidor_regional" as const,
  relationship_interest_other: null,
  interest_reason: null,
  market_segment: "transporte" as const,
  market_segment_other: null,
  years_in_market: "5_a_10" as const,
  employee_count: "21_a_50" as const,
  main_challenges: ["alto_consumo"] as const,
  main_challenges_other: null,
  supplier_priorities: ["qualidade"] as const,
  works_with_professional_products: true,
  current_brands: null,
  geographic_scope: "regional" as const,
  has_sales_team: true,
  has_logistics_structure: true,
  initial_purchase_potential: "5000_a_20000" as const,
  interested_in_training: true,
  pioneer_partners_interest: "sim_tenho_interesse" as const,
};

describe("partnerApplicationSchema", () => {
  it("aceita um input válido de Pessoa Jurídica", () => {
    const result = partnerApplicationSchema.safeParse(BASE_PJ_INPUT);
    expect(result.success).toBe(true);
  });

  it("aceita um input válido de Pessoa Física (sem trade_name)", () => {
    const result = partnerApplicationSchema.safeParse({
      ...BASE_PJ_INPUT,
      document_type: "cpf",
      document_number: VALID_CPF,
      legal_name: "João Pereira",
      trade_name: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejeita CNPJ quando document_type = 'cpf' (FR-007)", () => {
    const result = partnerApplicationSchema.safeParse({
      ...BASE_PJ_INPUT,
      document_type: "cpf",
      document_number: VALID_CNPJ,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita trade_name preenchido quando document_type = 'cpf'", () => {
    const result = partnerApplicationSchema.safeParse({
      ...BASE_PJ_INPUT,
      document_type: "cpf",
      document_number: VALID_CPF,
      trade_name: "Não deveria existir",
    });

    expect(result.success).toBe(false);
  });

  it("mantém trade_name disponível e valida como CNPJ quando document_type = 'cnpj' (FR-008)", () => {
    const result = partnerApplicationSchema.safeParse(BASE_PJ_INPUT);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.trade_name).toBe("Exemplo Transportes");
  });

  it("rejeita documento com checksum inválido independentemente do tipo (FR-009)", () => {
    const resultCnpj = partnerApplicationSchema.safeParse({
      ...BASE_PJ_INPUT,
      document_number: "11222333000100",
    });
    const resultCpf = partnerApplicationSchema.safeParse({
      ...BASE_PJ_INPUT,
      document_type: "cpf",
      document_number: "52998224700",
      trade_name: null,
    });

    expect(resultCnpj.success).toBe(false);
    expect(resultCpf.success).toBe(false);
  });

  it("rejeita e-mail em formato inválido", () => {
    const result = partnerApplicationSchema.safeParse({ ...BASE_PJ_INPUT, email: "nao-e-email" });
    expect(result.success).toBe(false);
  });

  it("rejeita quando product_id está ausente", () => {
    const result = partnerApplicationSchema.safeParse({ ...BASE_PJ_INPUT, product_id: "" });
    expect(result.success).toBe(false);
  });
});
