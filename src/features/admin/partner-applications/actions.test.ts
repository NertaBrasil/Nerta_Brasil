import { beforeEach, describe, expect, it, vi } from "vitest";

const FIXTURE_PROFILE = {
  id: "admin-1",
  name: "Admin",
  role: "admin" as const,
  created_at: "2026-01-01T00:00:00Z",
  email: "admin@nerta.com.br",
};

const FIXTURE_SUMMARY_ROW = {
  id: "app-1",
  legal_name: "Transportes Exemplo Ltda",
  document_type: "cnpj",
  product_name_snapshot: "Truck Clean",
  relationship_interest: "distribuidor_regional",
  created_at: "2026-06-20T10:00:00Z",
};

const FIXTURE_FULL_ROW = {
  ...FIXTURE_SUMMARY_ROW,
  product_id: "prod-1",
  document_number: "11222333000181",
  trade_name: "Exemplo Transportes",
  city: "São Paulo",
  state: "SP",
  website: null,
  contact_name: "Maria Silva",
  contact_role: "Gerente de Compras",
  phone: "+55 11 99999-0000",
  email: "maria@exemplo.com.br",
  linkedin_url: null,
  relationship_interest_other: null,
  interest_reason: null,
  market_segment: "transporte",
  market_segment_other: null,
  years_in_market: "5_a_10",
  employee_count: "21_a_50",
  main_challenges: ["alto_consumo"],
  main_challenges_other: null,
  supplier_priorities: ["qualidade"],
  works_with_professional_products: true,
  current_brands: null,
  geographic_scope: "regional",
  has_sales_team: true,
  has_logistics_structure: true,
  initial_purchase_potential: "5000_a_20000",
  interested_in_training: true,
  pioneer_partners_interest: "sim_tenho_interesse",
};

function createOrderQueryBuilder(data: unknown, error: unknown = null) {
  const builder: {
    select: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { data: unknown; error: unknown }) => unknown) => Promise<unknown>;
  } = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ data, error }).then(resolve),
  };
  return builder;
}

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

const fromMock = vi.fn();
const getCurrentAdminProfileMock = vi.fn();

vi.mock("@/infrastructure/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from: fromMock })),
}));

vi.mock("@/features/admin/auth", () => ({
  getCurrentAdminProfile: getCurrentAdminProfileMock,
}));

const { getPartnerApplications, getPartnerApplicationById } = await import("./actions");

describe("getPartnerApplications", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await getPartnerApplications();

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });

  it("retorna a lista ordenada por created_at DESC", async () => {
    const builder = createOrderQueryBuilder([FIXTURE_SUMMARY_ROW]);
    fromMock.mockReturnValueOnce(builder);

    const result = await getPartnerApplications();

    expect(builder.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual({ success: true, data: [FIXTURE_SUMMARY_ROW] });
  });
});

describe("getPartnerApplicationById", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await getPartnerApplicationById("app-1");

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });

  it("retorna a submissão completa com o produto de origem", async () => {
    const builder = createSingleQueryBuilder(FIXTURE_FULL_ROW);
    fromMock.mockReturnValueOnce(builder);

    const result = await getPartnerApplicationById("app-1");

    expect(builder.eq).toHaveBeenCalledWith("id", "app-1");
    expect(result).toEqual({ success: true, data: FIXTURE_FULL_ROW });
  });

  it("retorna erro claro quando o id não existe", async () => {
    const builder = createSingleQueryBuilder(null, { code: "PGRST116" });
    fromMock.mockReturnValueOnce(builder);

    const result = await getPartnerApplicationById("id-inexistente");

    expect(result).toEqual({ success: false, error: "Candidatura não encontrada." });
  });
});
