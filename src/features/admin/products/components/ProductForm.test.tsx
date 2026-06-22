import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const createProductMock = vi.fn();
const updateProductMock = vi.fn();
vi.mock("../actions", () => ({
  createProduct: createProductMock,
  updateProduct: updateProductMock,
}));

const refreshMock = vi.fn();
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock, push: pushMock }),
}));

const { ProductForm } = await import("./ProductForm");

const CATEGORIES = [
  { id: "cat-1", name: "Frotas", slug: "frotas", created_at: "2026-01-01" },
  { id: "cat-2", name: "Agro", slug: "agro", created_at: "2026-01-01" },
];

describe("ProductForm", () => {
  beforeEach(() => {
    createProductMock.mockReset();
    updateProductMock.mockReset();
    refreshMock.mockReset();
    pushMock.mockReset();
  });

  it("sugere o slug a partir do nome digitado", async () => {
    render(<ProductForm categories={CATEGORIES} />);

    await userEvent.type(screen.getByLabelText(/^nome$/i), "Truck Clean");

    expect(screen.getByLabelText(/slug/i)).toHaveValue("truck-clean");
  });

  it("permite edição manual do slug sugerido antes de salvar", async () => {
    render(<ProductForm categories={CATEGORIES} />);

    await userEvent.type(screen.getByLabelText(/^nome$/i), "Truck Clean");
    const slugInput = screen.getByLabelText(/slug/i);
    await userEvent.clear(slugInput);
    await userEvent.type(slugInput, "truck-clean-custom");

    expect(slugInput).toHaveValue("truck-clean-custom");
  });

  it("exibe erro de validação retornado quando categoria está ausente", async () => {
    createProductMock.mockResolvedValue({
      success: false,
      error: "Categoria é obrigatória.",
    });

    render(<ProductForm categories={CATEGORIES} />);

    await userEvent.type(screen.getByLabelText(/^nome$/i), "Truck Clean");
    await userEvent.type(screen.getByLabelText(/linha comercial/i), "Linha Frotas");
    await userEvent.type(screen.getByLabelText(/estoque/i), "10");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText("Categoria é obrigatória.")).toBeInTheDocument();
  });

  it("chama createProduct com os dados preenchidos ao submeter", async () => {
    createProductMock.mockResolvedValue({ success: true, data: { id: "prod-1" } });

    render(<ProductForm categories={CATEGORIES} />);

    await userEvent.type(screen.getByLabelText(/^nome$/i), "Truck Clean");
    await userEvent.type(screen.getByLabelText(/linha comercial/i), "Linha Frotas");
    await userEvent.selectOptions(screen.getByLabelText(/categoria/i), "cat-1");
    await userEvent.type(screen.getByLabelText(/estoque/i), "10");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(createProductMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Truck Clean",
        slug: "truck-clean",
        line: "Linha Frotas",
        category_id: "cat-1",
        stock: 10,
        active: true,
      })
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/produtos");
  });

  it("em modo edição, pré-popula os campos existentes e chama updateProduct ao salvar", async () => {
    updateProductMock.mockResolvedValue({ success: true, data: { id: "prod-1" } });
    const product = {
      id: "prod-1",
      slug: "truck-clean",
      name: "Truck Clean",
      line: "Linha Frotas",
      category_id: "cat-1",
      category: CATEGORIES[0],
      dilution: "3-5%",
      attributes: ["Touchless"],
      short_description: "Resumo",
      description: "Descrição",
      stock: 10,
      featured: false,
      active: true,
      ml_url: "https://produto.mercadolivre.com.br/1",
      purchase_mode: "mercado_livre" as const,
      images: [],
      cover_image: null,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    };

    render(<ProductForm categories={CATEGORIES} product={product} />);

    expect(screen.getByLabelText(/^nome$/i)).toHaveValue("Truck Clean");
    expect(screen.getByLabelText(/estoque/i)).toHaveValue(10);

    const stockInput = screen.getByLabelText(/estoque/i);
    await userEvent.clear(stockInput);
    await userEvent.type(stockInput, "20");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(updateProductMock).toHaveBeenCalledWith(expect.objectContaining({ id: "prod-1", stock: 20 }));
    expect(createProductMock).not.toHaveBeenCalled();
  });

  it("ao escolher modo de compra 'Formulário de Parceria', oculta o campo Link Mercado Livre e não o exige", async () => {
    createProductMock.mockResolvedValue({ success: true, data: { id: "prod-1" } });

    render(<ProductForm categories={CATEGORIES} />);

    await userEvent.selectOptions(screen.getByLabelText(/modo de compra/i), "formulario_parceria");
    expect(screen.queryByLabelText(/link mercado livre/i)).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/^nome$/i), "Truck Clean");
    await userEvent.type(screen.getByLabelText(/linha comercial/i), "Linha Frotas");
    await userEvent.selectOptions(screen.getByLabelText(/categoria/i), "cat-1");
    await userEvent.type(screen.getByLabelText(/estoque/i), "10");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(createProductMock).toHaveBeenCalledWith(
      expect.objectContaining({ purchase_mode: "formulario_parceria", ml_url: null })
    );
  });
});
