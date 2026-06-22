import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedSection } from "./FeaturedSection";
import type { ProductSummary } from "../types";

const product: ProductSummary = {
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
};

describe("FeaturedSection", () => {
  it("renderiza o grid de produtos em destaque quando há itens", () => {
    render(<FeaturedSection products={[product]} />);
    expect(screen.getByText("Produto Destaque")).toBeInTheDocument();
  });

  it("não renderiza nada (estado neutro, sem erro) quando a lista está vazia", () => {
    const { container } = render(<FeaturedSection products={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
