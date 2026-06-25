import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGallery } from "./ProductGallery";
import type { ProductImage } from "../types";

const images: ProductImage[] = [
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
];

describe("ProductGallery", () => {
  it("exibe placeholder quando o produto não tem nenhuma imagem", () => {
    render(<ProductGallery images={[]} productName="Produto Teste" />);
    expect(screen.getByTestId("product-gallery-image-placeholder")).toBeInTheDocument();
  });

  it("exibe a primeira imagem (principal) em destaque ao carregar", () => {
    render(<ProductGallery images={images} productName="Produto Teste" />);

    expect(screen.getByRole("img", { name: "Produto Teste" })).toHaveAttribute(
      "src",
      "https://cdn.example.com/1.png"
    );
  });

  it("não exibe thumbnails ou setas quando há apenas uma imagem", () => {
    render(<ProductGallery images={[images[0]]} productName="Produto Teste" />);

    expect(screen.queryByRole("button", { name: "Próxima imagem" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ver imagem 1" })).not.toBeInTheDocument();
  });

  it("troca a imagem em destaque ao clicar em uma thumbnail", async () => {
    render(<ProductGallery images={images} productName="Produto Teste" />);

    await userEvent.click(screen.getByRole("button", { name: "Ver imagem 2" }));

    expect(screen.getByRole("img", { name: "Produto Teste" })).toHaveAttribute(
      "src",
      "https://cdn.example.com/2.png"
    );
  });

  it("avança para a próxima imagem ao clicar na seta", async () => {
    render(<ProductGallery images={images} productName="Produto Teste" />);

    await userEvent.click(screen.getByRole("button", { name: "Próxima imagem" }));

    expect(screen.getByRole("img", { name: "Produto Teste" })).toHaveAttribute(
      "src",
      "https://cdn.example.com/2.png"
    );
  });

  it("abre o lightbox ao clicar na imagem principal", async () => {
    render(<ProductGallery images={images} productName="Produto Teste" />);

    await userEvent.click(screen.getByRole("button", { name: "Ampliar imagem" }));

    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });
});
