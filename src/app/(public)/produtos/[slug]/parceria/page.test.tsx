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
  ml_url: null,
  purchase_mode: "formulario_parceria" as const,
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

vi.mock("@/features/partner-applications", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/partner-applications")>();
  return {
    ...actual,
    PartnerApplicationForm: ({ productId, productName }: { productId: string; productName: string }) => (
      <div data-testid="partner-application-form">
        {productId} - {productName}
      </div>
    ),
  };
});

const { default: PartnerApplicationPage } = await import("./page");

describe("PartnerApplicationPage", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    getProductBySlugMock.mockReset();
  });

  it("chama notFound() quando o produto não existe ou está inativo", async () => {
    getProductBySlugMock.mockResolvedValue(null);

    await expect(
      PartnerApplicationPage({ params: Promise.resolve({ slug: "slug-inexistente" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalledOnce();
  });

  it("renderiza o formulário de parceria com o produto encontrado", async () => {
    getProductBySlugMock.mockResolvedValue(FIXTURE_PRODUCT);

    const element = await PartnerApplicationPage({
      params: Promise.resolve({ slug: "produto-teste" }),
    });
    render(element);

    expect(screen.getByTestId("partner-application-form")).toHaveTextContent(
      "1 - Produto Teste"
    );
  });
});
