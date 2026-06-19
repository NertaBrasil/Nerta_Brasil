import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import type { ProductSummary } from "../types";

const baseProduct: ProductSummary = {
  id: "1",
  slug: "produto-teste",
  name: "Produto Teste",
  line: "Linha Frotas",
  category: null,
  short_description: "Descrição curta do produto",
  stock: 10,
  featured: false,
  active: true,
  ml_url: "https://produto.mercadolivre.com.br/1",
  cover_image: null,
};

describe("ProductCard", () => {
  it("exibe indicador de indisponibilidade quando stock = 0", () => {
    render(<ProductCard product={{ ...baseProduct, stock: 0 }} />);
    expect(screen.getByText(/indispon[íi]vel/i)).toBeInTheDocument();
  });

  it("não exibe indicador de indisponibilidade quando há estoque", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.queryByText(/indispon[íi]vel/i)).not.toBeInTheDocument();
  });

  it("exibe placeholder quando cover_image é null", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId("product-card-image-placeholder")).toBeInTheDocument();
  });

  it("exibe a imagem quando cover_image existe", () => {
    render(
      <ProductCard
        product={{
          ...baseProduct,
          cover_image: {
            id: "img-1",
            product_id: "1",
            storage_path: "products/1/1.png",
            url: "https://cdn.example.com/1.png",
            position: 1,
            created_at: "2026-01-01T00:00:00Z",
          },
        }}
      />
    );
    expect(screen.getByRole("img", { name: /produto teste/i })).toBeInTheDocument();
  });

  it("renderiza como link para a página de detalhe do produto", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/produtos/produto-teste");
  });
});
