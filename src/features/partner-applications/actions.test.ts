import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MainChallenge, SupplierPriority } from "./types";

const VALID_INPUT = {
  product_id: "prod-1",
  document_type: "cnpj" as const,
  document_number: "11222333000181",
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
  main_challenges: ["alto_consumo"] as MainChallenge[],
  main_challenges_other: null,
  supplier_priorities: ["qualidade"] as SupplierPriority[],
  works_with_professional_products: true,
  current_brands: null,
  geographic_scope: "regional" as const,
  has_sales_team: true,
  has_logistics_structure: true,
  initial_purchase_potential: "5000_a_20000" as const,
  interested_in_training: true,
  pioneer_partners_interest: "sim_tenho_interesse" as const,
};

function createSingleQueryBuilder(data: unknown, error: unknown = null) {
  const builder: {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    single: ReturnType<typeof vi.fn>;
  } = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve({ data, error })),
  };
  return builder;
}

function createInsertBuilder(error: unknown = null) {
  const builder: {
    insert: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { error: unknown }) => unknown) => Promise<unknown>;
  } = {
    insert: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ error }).then(resolve),
  };
  return builder;
}

const fromMock = vi.fn();
vi.mock("@/infrastructure/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from: fromMock })),
}));

const { submitPartnerApplication } = await import("./actions");

describe("submitPartnerApplication", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("não exige sessão — visitante anônimo consegue enviar", async () => {
    const productBuilder = createSingleQueryBuilder({ name: "Truck Clean" });
    const insertBuilder = createInsertBuilder();
    fromMock.mockReturnValueOnce(productBuilder).mockReturnValueOnce(insertBuilder);

    const result = await submitPartnerApplication(VALID_INPUT);

    expect(result).toEqual({ success: true, data: undefined });
  });

  it("resolve product_name_snapshot a partir do product_id e insere a submissão", async () => {
    const productBuilder = createSingleQueryBuilder({ name: "Truck Clean" });
    const insertBuilder = createInsertBuilder();
    fromMock.mockReturnValueOnce(productBuilder).mockReturnValueOnce(insertBuilder);

    await submitPartnerApplication(VALID_INPUT);

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(productBuilder.eq).toHaveBeenCalledWith("id", "prod-1");
    expect(fromMock).toHaveBeenCalledWith("partner_applications");
    expect(insertBuilder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ product_id: "prod-1", product_name_snapshot: "Truck Clean" })
    );
  });

  it("retorna erro de validação sem inserir quando o documento é inválido", async () => {
    const result = await submitPartnerApplication({
      ...VALID_INPUT,
      document_number: "11222333000100",
    });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("retorna erro quando o produto de origem não é encontrado", async () => {
    const productBuilder = createSingleQueryBuilder(null, { code: "PGRST116" });
    fromMock.mockReturnValueOnce(productBuilder);

    const result = await submitPartnerApplication(VALID_INPUT);

    expect(result.success).toBe(false);
  });
});
