import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const createCategoryMock = vi.fn();
const updateCategoryMock = vi.fn();
vi.mock("../actions", () => ({
  createCategory: createCategoryMock,
  updateCategory: updateCategoryMock,
}));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const { CategoryForm } = await import("./CategoryForm");

const EXISTING_CATEGORY = {
  id: "cat-1",
  name: "Linha Frotas",
  slug: "linha-frotas",
  created_at: "2026-01-01",
};

describe("CategoryForm", () => {
  beforeEach(() => {
    createCategoryMock.mockReset();
    updateCategoryMock.mockReset();
    refreshMock.mockReset();
  });

  it("sugere o slug a partir do nome digitado", async () => {
    render(<CategoryForm />);

    await userEvent.type(screen.getByLabelText(/nome/i), "Linha Frotas");

    expect(screen.getByLabelText(/slug/i)).toHaveValue("linha-frotas");
  });

  it("permite edição manual do slug sugerido antes de salvar", async () => {
    render(<CategoryForm />);

    await userEvent.type(screen.getByLabelText(/nome/i), "Linha Frotas");
    const slugInput = screen.getByLabelText(/slug/i);
    await userEvent.clear(slugInput);
    await userEvent.type(slugInput, "frotas-custom");

    expect(slugInput).toHaveValue("frotas-custom");
  });

  it("chama createCategory com nome e slug ao submeter", async () => {
    createCategoryMock.mockResolvedValue({
      success: true,
      data: { id: "cat-1", name: "Linha Frotas", slug: "linha-frotas", created_at: "2026-01-01" },
    });

    render(<CategoryForm />);

    await userEvent.type(screen.getByLabelText(/nome/i), "Linha Frotas");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(createCategoryMock).toHaveBeenCalledWith({ name: "Linha Frotas", slug: "linha-frotas" });
  });

  it("exibe erro retornado por createCategory sem fechar o formulário", async () => {
    createCategoryMock.mockResolvedValue({
      success: false,
      error: "Já existe uma categoria com esse nome ou slug.",
    });

    render(<CategoryForm />);

    await userEvent.type(screen.getByLabelText(/nome/i), "Linha Frotas");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(
      await screen.findByText("Já existe uma categoria com esse nome ou slug.")
    ).toBeInTheDocument();
  });

  it("em modo edição, pré-popula nome e slug da categoria existente", () => {
    render(<CategoryForm category={EXISTING_CATEGORY} />);

    expect(screen.getByLabelText(/nome/i)).toHaveValue("Linha Frotas");
    expect(screen.getByLabelText(/slug/i)).toHaveValue("linha-frotas");
  });

  it("em modo edição, chama updateCategory com o id existente ao submeter alteração", async () => {
    updateCategoryMock.mockResolvedValue({ success: true, data: EXISTING_CATEGORY });

    render(<CategoryForm category={EXISTING_CATEGORY} />);

    const nameInput = screen.getByLabelText(/nome/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Linha Frotas Pesadas");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(updateCategoryMock).toHaveBeenCalledWith({
      id: "cat-1",
      name: "Linha Frotas Pesadas",
      slug: "linha-frotas",
    });
    expect(createCategoryMock).not.toHaveBeenCalled();
  });

  it("chama onSuccess e atualiza a rota após salvar com sucesso", async () => {
    createCategoryMock.mockResolvedValue({
      success: true,
      data: { id: "cat-1", name: "Linha Frotas", slug: "linha-frotas", created_at: "2026-01-01" },
    });
    const onSuccess = vi.fn();

    render(<CategoryForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/nome/i), "Linha Frotas");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(onSuccess).toHaveBeenCalled();
    expect(refreshMock).toHaveBeenCalled();
  });
});
