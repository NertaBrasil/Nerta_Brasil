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

function createQueryBuilder() {
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
    then: (resolve) => Promise.resolve({ data: FIXTURE_PRODUCTS, error: null }).then(resolve),
  };
  return builder;
}

const fromMock = vi.fn();

vi.mock("@/infrastructure/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from: fromMock })),
}));

const { getProducts } = await import("./queries");

describe("getProducts", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("consulta a tabela products filtrando active = true", async () => {
    const builder = createQueryBuilder();
    fromMock.mockReturnValue(builder);

    await getProducts();

    expect(fromMock).toHaveBeenCalledWith("products");
    expect(builder.eq).toHaveBeenCalledWith("active", true);
  });

  it("inclui produtos com stock = 0 no resultado", async () => {
    const builder = createQueryBuilder();
    fromMock.mockReturnValue(builder);

    const products = await getProducts();

    expect(products).toHaveLength(2);
    const semEstoque = products.find((product) => product.slug === "produto-sem-estoque");
    expect(semEstoque?.stock).toBe(0);
  });

  it("mapeia a primeira imagem (position = 1) como cover_image", async () => {
    const builder = createQueryBuilder();
    fromMock.mockReturnValue(builder);

    const products = await getProducts();

    const disponivel = products.find((product) => product.slug === "produto-disponivel");
    expect(disponivel?.cover_image?.url).toBe("https://cdn.example.com/1.png");

    const semEstoque = products.find((product) => product.slug === "produto-sem-estoque");
    expect(semEstoque?.cover_image).toBeNull();
  });
});
