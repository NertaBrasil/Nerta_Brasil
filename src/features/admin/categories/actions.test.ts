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

function createCountQueryBuilder(count: number, error: unknown = null) {
  const builder: {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { count: number; error: unknown }) => unknown) => Promise<unknown>;
  } = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ count, error }).then(resolve),
  };
  return builder;
}

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

const { createCategory, deleteCategory, updateCategory } = await import("./actions");

describe("createCategory", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("gera o slug a partir do nome quando não informado explicitamente já tratado pelo form, mas aceita slug customizado enviado", async () => {
    const builder = createSingleQueryBuilder({
      id: "cat-1",
      name: "Linha Frotas",
      slug: "linha-frotas-customizado",
      created_at: "2026-01-01T00:00:00Z",
    });
    fromMock.mockReturnValue(builder);

    const result = await createCategory({ name: "Linha Frotas", slug: "linha-frotas-customizado" });

    expect(fromMock).toHaveBeenCalledWith("categories");
    expect(builder.insert).toHaveBeenCalledWith({
      name: "Linha Frotas",
      slug: "linha-frotas-customizado",
    });
    expect(result).toEqual({
      success: true,
      data: {
        id: "cat-1",
        name: "Linha Frotas",
        slug: "linha-frotas-customizado",
        created_at: "2026-01-01T00:00:00Z",
      },
    });
  });

  it("rejeita nome/slug já usados por outra categoria com erro de duplicidade", async () => {
    const builder = createSingleQueryBuilder(null, { code: "23505" });
    fromMock.mockReturnValue(builder);

    const result = await createCategory({ name: "Linha Agro", slug: "linha-agro" });

    expect(result).toEqual({
      success: false,
      error: "Já existe uma categoria com esse nome ou slug.",
    });
  });

  it("rejeita entrada com slug vazio sem chamar o Supabase", async () => {
    const result = await createCategory({ name: "Linha Agro", slug: "" });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await createCategory({ name: "Linha Agro", slug: "linha-agro" });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});

describe("deleteCategory", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("bloqueia a exclusão e retorna mensagem explicativa quando há produtos vinculados", async () => {
    const countBuilder = createCountQueryBuilder(2);
    fromMock.mockReturnValueOnce(countBuilder);

    const result = await deleteCategory("cat-1");

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(countBuilder.eq).toHaveBeenCalledWith("category_id", "cat-1");
    expect(result).toEqual({
      success: false,
      error: "Categoria possui produtos vinculados. Reclassifique os produtos antes de excluir.",
    });
  });

  it("permite a exclusão quando não há produtos vinculados", async () => {
    const countBuilder = createCountQueryBuilder(0);
    const deleteBuilder = createDeleteQueryBuilder();
    fromMock.mockReturnValueOnce(countBuilder).mockReturnValueOnce(deleteBuilder);

    const result = await deleteCategory("cat-1");

    expect(fromMock).toHaveBeenCalledWith("categories");
    expect(deleteBuilder.eq).toHaveBeenCalledWith("id", "cat-1");
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await deleteCategory("cat-1");

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});

describe("updateCategory", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(FIXTURE_PROFILE);
  });

  it("atualiza nome e slug com sucesso", async () => {
    const builder = createSingleQueryBuilder({
      id: "cat-1",
      name: "Linha Frotas Pesadas",
      slug: "linha-frotas-pesadas",
      created_at: "2026-01-01T00:00:00Z",
    });
    fromMock.mockReturnValue(builder);

    const result = await updateCategory({
      id: "cat-1",
      name: "Linha Frotas Pesadas",
      slug: "linha-frotas-pesadas",
    });

    expect(fromMock).toHaveBeenCalledWith("categories");
    expect(builder.update).toHaveBeenCalledWith({
      name: "Linha Frotas Pesadas",
      slug: "linha-frotas-pesadas",
    });
    expect(builder.eq).toHaveBeenCalledWith("id", "cat-1");
    expect(result.success).toBe(true);
  });

  it("rejeita slug que já pertence a outra categoria com erro de duplicidade", async () => {
    const builder = createSingleQueryBuilder(null, { code: "23505" });
    fromMock.mockReturnValue(builder);

    const result = await updateCategory({ id: "cat-1", name: "Linha Agro", slug: "linha-frotas" });

    expect(result).toEqual({
      success: false,
      error: "Já existe uma categoria com esse nome ou slug.",
    });
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await updateCategory({ id: "cat-1", name: "Linha Agro", slug: "linha-agro" });

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: "Não autenticado." });
  });
});
