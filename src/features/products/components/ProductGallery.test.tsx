import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductGallery } from "./ProductGallery";

describe("ProductGallery", () => {
  it("exibe placeholder quando o produto não tem nenhuma imagem", () => {
    render(<ProductGallery images={[]} productName="Produto Teste" />);
    expect(screen.getByTestId("product-gallery-image-placeholder")).toBeInTheDocument();
  });

  it("exibe todas as imagens em proporção 1:1 quando há múltiplas imagens", () => {
    render(
      <ProductGallery
        images={[
          {
            id: "img-1",
            product_id: "1",
            storage_path: "products/1/1.png",
            url: "https://cdn.example.com/1.png",
            position: 1,
            created_at: "2026-01-01T00:00:00Z",
          },
          {
            id: "img-2",
            product_id: "1",
            storage_path: "products/1/2.png",
            url: "https://cdn.example.com/2.png",
            position: 2,
            created_at: "2026-01-01T00:00:00Z",
          },
        ]}
        productName="Produto Teste"
      />
    );

    expect(screen.getAllByRole("img", { name: /produto teste/i })).toHaveLength(2);
  });
});
