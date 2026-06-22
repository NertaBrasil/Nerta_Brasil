import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const FIXTURE_PRODUCT = {
  id: "1",
  slug: "produto-teste",
  name: "Produto Teste",
  line: "Linha Frotas",
  category_id: "cat-1",
  category: { id: "cat-1", name: "Categoria A", slug: "categoria-a", created_at: "2026-01-01T00:00:00Z" },
  dilution: "3–5%",
  attributes: ["Touchless"],
  short_description: "Resumo",
  description: "Descrição completa do produto teste",
  stock: 10,
  featured: false,
  active: true,
  ml_url: "https://produto.mercadolivre.com.br/1",
  purchase_mode: "mercado_livre" as const,
  images: [],
  cover_image: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const notFoundMock = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));

const getProductBySlugMock = vi.fn();
vi.mock("@/features/products", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/products")>();
  return { ...actual, getProductBySlug: getProductBySlugMock };
});

const { default: ProductPage } = await import("./page");

describe("ProductPage", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    getProductBySlugMock.mockReset();
  });

  it("chama notFound() quando getProductBySlug retorna null", async () => {
    getProductBySlugMock.mockResolvedValue(null);

    await expect(
      ProductPage({ params: Promise.resolve({ slug: "slug-inexistente" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalledOnce();
  });

  it("renderiza nome, linha comercial, descrição e categoria do produto encontrado", async () => {
    getProductBySlugMock.mockResolvedValue(FIXTURE_PRODUCT);

    const element = await ProductPage({ params: Promise.resolve({ slug: "produto-teste" }) });
    render(element);

    expect(screen.getByText("Produto Teste")).toBeInTheDocument();
    expect(screen.getByText("Linha Frotas")).toBeInTheDocument();
    expect(screen.getByText("Descrição completa do produto teste")).toBeInTheDocument();
    expect(screen.getByText("Categoria A")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /comprar no mercado livre/i })).toHaveAttribute(
      "href",
      "https://produto.mercadolivre.com.br/1"
    );
  });

  it("renderiza normalmente quando a categoria está ausente (órfã)", async () => {
    getProductBySlugMock.mockResolvedValue({ ...FIXTURE_PRODUCT, category: null });

    const element = await ProductPage({ params: Promise.resolve({ slug: "produto-teste" }) });
    render(element);

    expect(screen.getByText("Produto Teste")).toBeInTheDocument();
    expect(screen.queryByText("Categoria A")).not.toBeInTheDocument();
  });
});
