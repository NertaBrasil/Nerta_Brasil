import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const deleteCategoryMock = vi.fn();
vi.mock("../actions", () => ({ deleteCategory: deleteCategoryMock }));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const { DeleteCategoryModal } = await import("./DeleteCategoryModal");

const CATEGORY = { id: "cat-1", name: "Linha Frotas", slug: "linha-frotas", created_at: "2026-01-01" };

describe("DeleteCategoryModal", () => {
  beforeEach(() => {
    deleteCategoryMock.mockReset();
    refreshMock.mockReset();
  });

  it("não renderiza nada quando open=false", () => {
    render(<DeleteCategoryModal category={CATEGORY} open={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exibe o diálogo de confirmação com scrim quando open=true", () => {
    render(<DeleteCategoryModal category={CATEGORY} open onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/linha frotas/i)).toBeInTheDocument();
  });

  it("exibe a mensagem de bloqueio retornada por deleteCategory quando há vínculo", async () => {
    deleteCategoryMock.mockResolvedValue({
      success: false,
      error: "Categoria possui produtos vinculados. Reclassifique os produtos antes de excluir.",
    });

    render(<DeleteCategoryModal category={CATEGORY} open onClose={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /excluir/i }));

    expect(
      await screen.findByText(
        "Categoria possui produtos vinculados. Reclassifique os produtos antes de excluir."
      )
    ).toBeInTheDocument();
  });

  it("fecha o modal e atualiza a listagem ao confirmar exclusão sem vínculo", async () => {
    deleteCategoryMock.mockResolvedValue({ success: true, data: undefined });
    const onClose = vi.fn();

    render(<DeleteCategoryModal category={CATEGORY} open onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: /excluir/i }));

    expect(deleteCategoryMock).toHaveBeenCalledWith("cat-1");
    expect(onClose).toHaveBeenCalled();
    expect(refreshMock).toHaveBeenCalled();
  });
});
