import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const getFeaturedProductsMock = vi.fn();
vi.mock("@/features/products", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/products")>();
  return { ...actual, getFeaturedProducts: getFeaturedProductsMock };
});

const { default: HomePage } = await import("./page");

describe("HomePage", () => {
  beforeEach(() => {
    getFeaturedProductsMock.mockReset();
  });

  it("exibe a seção institucional e um CTA para o catálogo completo", async () => {
    getFeaturedProductsMock.mockResolvedValue([]);

    const element = await HomePage();
    render(element);

    expect(
      screen.getByText("Tecnologia química europeia de alta performance.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explorar catálogo/i })).toHaveAttribute(
      "href",
      "/produtos"
    );
  });

  it("funciona como ponto de entrada autônomo quando não há produtos em destaque", async () => {
    getFeaturedProductsMock.mockResolvedValue([]);

    const element = await HomePage();
    render(element);

    expect(screen.queryByText("Destaques")).not.toBeInTheDocument();
  });

  it("exibe a seção de destaques com os produtos retornados por getFeaturedProducts", async () => {
    getFeaturedProductsMock.mockResolvedValue([
      {
        id: "1",
        slug: "produto-destaque",
        name: "Produto Destaque",
        line: "Linha Frotas",
        category: null,
        short_description: "Resumo",
        stock: 10,
        featured: true,
        active: true,
        ml_url: "https://produto.mercadolivre.com.br/1",
        cover_image: null,
      },
    ]);

    const element = await HomePage();
    render(element);

    expect(screen.getByText("Produto Destaque")).toBeInTheDocument();
  });
});
