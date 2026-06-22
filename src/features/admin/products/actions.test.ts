import { beforeEach, describe, expect, it, vi } from "vitest";

const FIXTURE_PROFILE = {
  id: "admin-1",
  name: "Admin",
  role: "admin" as const,
  created_at: "2026-01-01T00:00:00Z",
  email: "admin@nerta.com.br",
};

const FIXTURE_PRODUCT_ROW = {
  id: "prod-1",
  slug: "linha-frotas-truck-clean",
  name: "Truck Clean",
  line: "Linha Frotas",
  category_id: "cat-1",
  category: { id: "cat-1", name: "Frotas", slug: "frotas", created_at: "2026-01-01T00:00:00Z" },
  dilution: "3-5%",
  attributes: ["Touchless"],
  short_description: "Resumo",
  description: "Descrição completa",
  stock: 10,
  featured: false,
  active: true,
  ml_url: "https://produto.mercadolivre.com.br/1",
  images: [],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const VALID_INPUT = {
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
  ml_url: "https://produto.mercadolivre.com.br/1",
};

function createSingleQueryBuilder(data: unknown, error: unknown = null) {
  const builder: {
    insert: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    single: ReturnType<typeof vi.fn>;
  } = {
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve({ data, error })),
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

function createDeleteQueryBuilder(error: unknown = null) {
  const builder: {
    delete: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { error: unknown }) => unknown) => Promise<unknown>;
  } = {
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ error }).then(resolve),
  };
  return builder;
}

const { createProduct, updateProduct, toggleProductActive, deleteProduct } = await import(
  "./actions"
);

describe("createProduct", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("cria o produto com sucesso quando o input é válido", async () => {
    const builder = createSingleQueryBuilder(FIXTURE_PRODUCT_ROW);
    fromMock.mockReturnValue(builder);

    const result = await createProduct(VALID_INPUT);

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("linha-frotas-truck-clean");
      expect(result.data.category?.name).toBe("Frotas");
    }
  });

  it("rejeita slug já usado por outro produto com erro de duplicidade", async () => {
    const builder = createSingleQueryBuilder(null, { code: "23505" });
    fromMock.mockReturnValue(builder);

    const result = await createProduct(VALID_INPUT);

    expect(result).toEqual({ success: false, error: "Já existe um produto com esse slug." });
  });

  it("rejeita categoria inválida/inexistente (violação de FK)", async () => {
    const builder = createSingleQueryBuilder(null, { code: "23503" });
    fromMock.mockReturnValue(builder);

    const result = await createProduct(VALID_INPUT);

    expect(result).toEqual({
      success: false,
      error: "Categoria inválida. Selecione uma categoria existente.",
    });
  });

  it("rejeita estoque negativo sem chamar o Supabase", async () => {
    const result = await createProduct({ ...VALID_INPUT, stock: -1 });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("rejeita entrada sem categoria sem chamar o Supabase", async () => {
    const result = await createProduct({ ...VALID_INPUT, category_id: "" });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await createProduct(VALID_INPUT);

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});

describe("updateProduct", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("atualiza atributos com sucesso", async () => {
    const builder = createSingleQueryBuilder({ ...FIXTURE_PRODUCT_ROW, stock: 20 });
    fromMock.mockReturnValue(builder);

    const result = await updateProduct({ id: "prod-1", ...VALID_INPUT, stock: 20 });

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(builder.update).toHaveBeenCalledWith(expect.objectContaining({ stock: 20 }));
    expect(builder.eq).toHaveBeenCalledWith("id", "prod-1");
    expect(result.success).toBe(true);
  });

  it("rejeita slug que já pertence a outro produto com erro de duplicidade", async () => {
    const builder = createSingleQueryBuilder(null, { code: "23505" });
    fromMock.mockReturnValue(builder);

    const result = await updateProduct({ id: "prod-1", ...VALID_INPUT });

    expect(result).toEqual({ success: false, error: "Já existe um produto com esse slug." });
  });

  it("rejeita categoria inválida/excluída", async () => {
    const builder = createSingleQueryBuilder(null, { code: "23503" });
    fromMock.mockReturnValue(builder);

    const result = await updateProduct({ id: "prod-1", ...VALID_INPUT });

    expect(result).toEqual({
      success: false,
      error: "Categoria inválida. Selecione uma categoria existente.",
    });
  });

  it("rejeita estoque negativo sem chamar o Supabase", async () => {
    const result = await updateProduct({ id: "prod-1", ...VALID_INPUT, stock: -5 });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("alterna active via updateProduct sem alterar o estoque informado e vice-versa", async () => {
    const builder = createSingleQueryBuilder({ ...FIXTURE_PRODUCT_ROW, active: false });
    fromMock.mockReturnValue(builder);

    await updateProduct({ id: "prod-1", ...VALID_INPUT, active: false });

    expect(builder.update).toHaveBeenCalledWith(
      expect.objectContaining({ active: false, stock: VALID_INPUT.stock })
    );
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await updateProduct({ id: "prod-1", ...VALID_INPUT });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});

describe("toggleProductActive", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("atualiza apenas o campo active, sem enviar o restante do produto", async () => {
    const builder = createSingleQueryBuilder({ id: "prod-1", active: false });
    fromMock.mockReturnValue(builder);

    const result = await toggleProductActive("prod-1", false);

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(builder.update).toHaveBeenCalledWith({ active: false });
    expect(builder.eq).toHaveBeenCalledWith("id", "prod-1");
    expect(result).toEqual({ success: true, data: { id: "prod-1", active: false } });
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await toggleProductActive("prod-1", false);

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});

describe("deleteProduct", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("exclui o produto — imagens vinculadas são removidas em cascade pelo banco (ON DELETE CASCADE)", async () => {
    const builder = createDeleteQueryBuilder();
    fromMock.mockReturnValue(builder);

    const result = await deleteProduct("prod-1");

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(builder.eq).toHaveBeenCalledWith("id", "prod-1");
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await deleteProduct("prod-1");

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});
