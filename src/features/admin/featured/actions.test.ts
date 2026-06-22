import { beforeEach, describe, expect, it, vi } from "vitest";

const FIXTURE_PROFILE = {
  id: "admin-1",
  name: "Admin",
  role: "admin" as const,
  created_at: "2026-01-01T00:00:00Z",
  email: "admin@nerta.com.br",
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

function createOrderLimitQueryBuilder(data: unknown, error: unknown = null) {
  const builder: {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { data: unknown; error: unknown }) => unknown) => Promise<unknown>;
  } = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ data, error }).then(resolve),
  };
  return builder;
}

function createEqQueryBuilder(data: unknown, error: unknown = null) {
  const builder: {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { data: unknown; error: unknown }) => unknown) => Promise<unknown>;
  } = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ data, error }).then(resolve),
  };
  return builder;
}

function createUpdateEqBuilder(error: unknown = null) {
  const builder: {
    update: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { error: unknown }) => unknown) => Promise<unknown>;
  } = {
    update: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ error }).then(resolve),
  };
  return builder;
}

const fromMock = vi.fn();
const getCurrentAdminProfileMock = vi.fn();

vi.mock("@/infrastructure/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({ from: fromMock })),
}));

vi.mock("@/features/admin/auth", () => ({
  getCurrentAdminProfile: getCurrentAdminProfileMock,
}));

const { toggleFeatured, reorderFeatured } = await import("./actions");

describe("toggleFeatured", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("ao marcar um produto não destacado, atribui featured_position = MAX(featured_position) + 1", async () => {
    const fetchCurrentBuilder = createSingleQueryBuilder({ featured: false, featured_position: null });
    const maxPositionBuilder = createOrderLimitQueryBuilder([{ featured_position: 3 }]);
    const updateBuilder = createUpdateEqBuilder();
    fromMock
      .mockReturnValueOnce(fetchCurrentBuilder)
      .mockReturnValueOnce(maxPositionBuilder)
      .mockReturnValueOnce(updateBuilder);

    const result = await toggleFeatured("prod-1", true);

    expect(updateBuilder.update).toHaveBeenCalledWith({ featured: true, featured_position: 4 });
    expect(updateBuilder.eq).toHaveBeenCalledWith("id", "prod-1");
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("ao marcar o primeiro produto destacado (nenhum outro destacado), atribui featured_position = 1", async () => {
    const fetchCurrentBuilder = createSingleQueryBuilder({ featured: false, featured_position: null });
    const maxPositionBuilder = createOrderLimitQueryBuilder([]);
    const updateBuilder = createUpdateEqBuilder();
    fromMock
      .mockReturnValueOnce(fetchCurrentBuilder)
      .mockReturnValueOnce(maxPositionBuilder)
      .mockReturnValueOnce(updateBuilder);

    const result = await toggleFeatured("prod-1", true);

    expect(updateBuilder.update).toHaveBeenCalledWith({ featured: true, featured_position: 1 });
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("é idempotente — marcar um produto já destacado não altera sua featured_position", async () => {
    const fetchCurrentBuilder = createSingleQueryBuilder({ featured: true, featured_position: 2 });
    fromMock.mockReturnValueOnce(fetchCurrentBuilder);

    const result = await toggleFeatured("prod-1", true);

    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("permite marcar um produto inativo como destaque", async () => {
    const fetchCurrentBuilder = createSingleQueryBuilder({ featured: false, featured_position: null });
    const maxPositionBuilder = createOrderLimitQueryBuilder([]);
    const updateBuilder = createUpdateEqBuilder();
    fromMock
      .mockReturnValueOnce(fetchCurrentBuilder)
      .mockReturnValueOnce(maxPositionBuilder)
      .mockReturnValueOnce(updateBuilder);

    const result = await toggleFeatured("prod-inactive", true);

    expect(result).toEqual({ success: true, data: undefined });
  });

  it("ao desmarcar, define featured_position = NULL sem renumerar os demais", async () => {
    const updateBuilder = createUpdateEqBuilder();
    fromMock.mockReturnValueOnce(updateBuilder);

    const result = await toggleFeatured("prod-1", false);

    expect(updateBuilder.update).toHaveBeenCalledWith({ featured: false, featured_position: null });
    expect(updateBuilder.eq).toHaveBeenCalledWith("id", "prod-1");
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await toggleFeatured("prod-1", true);

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});

describe("reorderFeatured", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("rejeita quando productIds não corresponde ao conjunto atual de destacados (tamanho divergente)", async () => {
    const currentBuilder = createEqQueryBuilder([{ id: "prod-1" }, { id: "prod-2" }]);
    fromMock.mockReturnValueOnce(currentBuilder);

    const result = await reorderFeatured({ productIds: ["prod-1"] });

    expect(result).toEqual({
      success: false,
      error: "Lista de destaques inconsistente com o estado atual.",
    });
  });

  it("rejeita quando productIds contém um ID que não está destacado atualmente", async () => {
    const currentBuilder = createEqQueryBuilder([{ id: "prod-1" }, { id: "prod-2" }]);
    fromMock.mockReturnValueOnce(currentBuilder);

    const result = await reorderFeatured({ productIds: ["prod-1", "prod-3"] });

    expect(result).toEqual({
      success: false,
      error: "Lista de destaques inconsistente com o estado atual.",
    });
  });

  it("rejeita quando productIds contém duplicados", async () => {
    const currentBuilder = createEqQueryBuilder([{ id: "prod-1" }, { id: "prod-2" }]);
    fromMock.mockReturnValueOnce(currentBuilder);

    const result = await reorderFeatured({ productIds: ["prod-1", "prod-1"] });

    expect(result).toEqual({
      success: false,
      error: "Lista de destaques inconsistente com o estado atual.",
    });
  });

  it("atualiza featured_position de todos os produtos destacados para índice + 1, atomicamente", async () => {
    const currentBuilder = createEqQueryBuilder([{ id: "prod-1" }, { id: "prod-2" }]);
    const update1 = createUpdateEqBuilder();
    const update2 = createUpdateEqBuilder();
    fromMock
      .mockReturnValueOnce(currentBuilder)
      .mockReturnValueOnce(update1)
      .mockReturnValueOnce(update2);

    const result = await reorderFeatured({ productIds: ["prod-2", "prod-1"] });

    expect(update1.update).toHaveBeenCalledWith({ featured_position: 1 });
    expect(update1.eq).toHaveBeenCalledWith("id", "prod-2");
    expect(update2.update).toHaveBeenCalledWith({ featured_position: 2 });
    expect(update2.eq).toHaveBeenCalledWith("id", "prod-1");
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await reorderFeatured({ productIds: ["prod-1"] });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});
