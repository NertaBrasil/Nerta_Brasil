import { beforeEach, describe, expect, it, vi } from "vitest";

const FIXTURE_PRODUCTS = [
  {
    id: "1",
    slug: "produto-disponivel",
    name: "Produto Disponível",
    line: "Linha Frotas",
    short_description: "Resumo do produto disponível",
    stock: 10,
    featured: false,
    active: true,
    ml_url: "https://produto.mercadolivre.com.br/1",
    category: {
      id: "cat-1",
      name: "Categoria A",
      slug: "categoria-a",
      created_at: "2026-01-01T00:00:00Z",
    },
    images: [
      {
        id: "img-1",
        product_id: "1",
        storage_path: "products/1/1.png",
        url: "https://cdn.example.com/1.png",
        position: 1,
        created_at: "2026-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: "2",
    slug: "produto-sem-estoque",
    name: "Produto Sem Estoque",
    line: "Linha Agro",
    short_description: "Resumo do produto sem estoque",
    stock: 0,
    featured: false,
    active: true,
    ml_url: null,
    category: null,
    images: [],
  },
];

const FIXTURE_CATEGORIES = [
  { id: "cat-1", name: "Categoria A", slug: "categoria-a", created_at: "2026-01-01T00:00:00Z" },
  { id: "cat-2", name: "Categoria B", slug: "categoria-b", created_at: "2026-01-02T00:00:00Z" },
];

const FIXTURE_PRODUCT_DETAIL = {
  id: "1",
  slug: "produto-detalhe",
  name: "Produto Detalhe",
  line: "Linha Frotas",
  category_id: "cat-1",
  category: {
    id: "cat-1",
    name: "Categoria A",
    slug: "categoria-a",
    created_at: "2026-01-01T00:00:00Z",
  },
  dilution: "3–5%",
  attributes: ["Touchless", "Agro"],
  short_description: "Resumo do produto",
  description: "Descrição completa do produto",
  stock: 10,
  featured: false,
  active: true,
  ml_url: "https://produto.mercadolivre.com.br/1",
  images: [
    {
      id: "img-2",
      product_id: "1",
      storage_path: "products/1/2.png",
      url: "https://cdn.example.com/2.png",
      position: 2,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "img-1",
      product_id: "1",
      storage_path: "products/1/1.png",
      url: "https://cdn.example.com/1.png",
      position: 1,
      created_at: "2026-01-01T00:00:00Z",
    },
  ],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
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

function createQueryBuilder(data: unknown) {
  const builder: {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { data: unknown; error: null }) => unknown) => Promise<unknown>;
  } = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ data, error: null }).then(resolve),
  };
  return builder;
}

const fromMock = vi.fn();

vi.mock("@/infrastructure/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from: fromMock })),
}));

const { getProducts, getCategories, getProductBySlug } = await import("./queries");

describe("getProducts", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("consulta a tabela products filtrando active = true", async () => {
    const builder = createQueryBuilder(FIXTURE_PRODUCTS);
    fromMock.mockReturnValue(builder);

    await getProducts();

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(builder.eq).toHaveBeenCalledWith("active", true);
  });

  it("inclui produtos com stock = 0 no resultado", async () => {
    const builder = createQueryBuilder(FIXTURE_PRODUCTS);
    fromMock.mockReturnValue(builder);

    const products = await getProducts();

    expect(products).toHaveLength(2);
    const semEstoque = products.find((product) => product.slug === "produto-sem-estoque");
    expect(semEstoque?.stock).toBe(0);
  });

  it("mapeia a primeira imagem (position = 1) como cover_image", async () => {
    const builder = createQueryBuilder(FIXTURE_PRODUCTS);
    fromMock.mockReturnValue(builder);

    const products = await getProducts();

    const disponivel = products.find((product) => product.slug === "produto-disponivel");
    expect(disponivel?.cover_image?.url).toBe("https://cdn.example.com/1.png");

    const semEstoque = products.find((product) => product.slug === "produto-sem-estoque");
    expect(semEstoque?.cover_image).toBeNull();
  });

  it("filtra por category_slug quando informado", async () => {
    const builder = createQueryBuilder([FIXTURE_PRODUCTS[0]]);
    fromMock.mockReturnValue(builder);

    const products = await getProducts({ category_slug: "categoria-a" });

    expect(builder.eq).toHaveBeenCalledWith("active", true);
    expect(builder.eq).toHaveBeenCalledWith("category.slug", "categoria-a");
    expect(products).toHaveLength(1);
    expect(products[0].category?.slug).toBe("categoria-a");
  });
});

describe("getCategories", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("consulta a tabela categories ordenada por name ASC", async () => {
    const builder = createQueryBuilder(FIXTURE_CATEGORIES);
    fromMock.mockReturnValue(builder);

    const categories = await getCategories();

    expect(fromMock).toHaveBeenCalledWith("categories");
    expect(builder.order).toHaveBeenCalledWith("name", { ascending: true });
    expect(categories).toHaveLength(2);
    expect(categories[0].slug).toBe("categoria-a");
  });
});

describe("getProductBySlug", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("consulta a tabela products filtrando por slug e active = true", async () => {
    const builder = createSingleQueryBuilder(FIXTURE_PRODUCT_DETAIL);
    fromMock.mockReturnValue(builder);

    await getProductBySlug("produto-detalhe");

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(builder.eq).toHaveBeenCalledWith("slug", "produto-detalhe");
    expect(builder.eq).toHaveBeenCalledWith("active", true);
  });

  it("retorna o produto completo com a galeria ordenada por position ASC", async () => {
    const builder = createSingleQueryBuilder(FIXTURE_PRODUCT_DETAIL);
    fromMock.mockReturnValue(builder);

    const product = await getProductBySlug("produto-detalhe");

    expect(product?.images.map((image) => image.position)).toEqual([1, 2]);
    expect(product?.cover_image?.position).toBe(1);
    expect(product?.dilution).toBe("3–5%");
    expect(product?.attributes).toEqual(["Touchless", "Agro"]);
  });

  it("retorna null quando o slug não corresponde a nenhum produto", async () => {
    const builder = createSingleQueryBuilder(null, { code: "PGRST116" });
    fromMock.mockReturnValue(builder);

    const product = await getProductBySlug("slug-inexistente");

    expect(product).toBeNull();
  });

  it("retorna null para produto inativo (mesmo retorno que slug inexistente)", async () => {
    const builder = createSingleQueryBuilder(null, { code: "PGRST116" });
    fromMock.mockReturnValue(builder);

    const product = await getProductBySlug("produto-inativo");

    expect(product).toBeNull();
    expect(builder.eq).toHaveBeenCalledWith("active", true);
  });

  it("retorna o produto normalmente quando a categoria está ausente (órfã)", async () => {
    const builder = createSingleQueryBuilder({ ...FIXTURE_PRODUCT_DETAIL, category: null });
    fromMock.mockReturnValue(builder);

    const product = await getProductBySlug("produto-detalhe");

    expect(product?.category).toBeNull();
    expect(product?.name).toBe("Produto Detalhe");
  });
});
