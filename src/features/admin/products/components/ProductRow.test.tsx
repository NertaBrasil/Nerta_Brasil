import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const toggleProductActiveMock = vi.fn();
const deleteProductMock = vi.fn();
vi.mock("../actions", () => ({
  toggleProductActive: toggleProductActiveMock,
  deleteProduct: deleteProductMock,
}));

const toggleFeaturedMock = vi.fn();
vi.mock("@/features/admin/featured", () => ({
  toggleFeatured: toggleFeaturedMock,
}));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const { ProductRow } = await import("./ProductRow");

const PRODUCT = {
  id: "prod-1",
  slug: "truck-clean",
  name: "Truck Clean",
  line: "Linha Frotas",
  category: { id: "cat-1", name: "Frotas", slug: "frotas", created_at: "2026-01-01" },
  short_description: "Resumo",
  stock: 10,
  featured: false,
  active: true,
  ml_url: "https://produto.mercadolivre.com.br/1",
  cover_image: null,
};

describe("ProductRow", () => {
  beforeEach(() => {
    toggleProductActiveMock.mockReset();
    deleteProductMock.mockReset();
    toggleFeaturedMock.mockReset();
    refreshMock.mockReset();
  });

  it("alterna o status imediatamente ao clicar, sem abrir o formulário completo", async () => {
    toggleProductActiveMock.mockResolvedValue({
      success: true,
      data: { id: "prod-1", active: false },
    });

    render(
      <table>
        <tbody>
          <ProductRow product={PRODUCT} />
        </tbody>
      </table>
    );

    await userEvent.click(screen.getByRole("button", { name: /desativar/i }));

    expect(toggleProductActiveMock).toHaveBeenCalledWith("prod-1", false);
    expect(refreshMock).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /editar/i })).toHaveAttribute(
      "href",
      "/admin/produtos/prod-1"
    );
  });

  it("marca o produto como destaque em uma única interação", async () => {
    toggleFeaturedMock.mockResolvedValue({ success: true, data: undefined });

    render(
      <table>
        <tbody>
          <ProductRow product={PRODUCT} />
        </tbody>
      </table>
    );

    await userEvent.click(screen.getByRole("button", { name: /destacar/i }));

    expect(toggleFeaturedMock).toHaveBeenCalledWith("prod-1", true);
    expect(refreshMock).toHaveBeenCalled();
  });

  it("remove o destaque quando o produto já está destacado", async () => {
    toggleFeaturedMock.mockResolvedValue({ success: true, data: undefined });

    render(
      <table>
        <tbody>
          <ProductRow product={{ ...PRODUCT, featured: true }} />
        </tbody>
      </table>
    );

    await userEvent.click(screen.getByRole("button", { name: /remover destaque/i }));

    expect(toggleFeaturedMock).toHaveBeenCalledWith("prod-1", false);
  });
});
