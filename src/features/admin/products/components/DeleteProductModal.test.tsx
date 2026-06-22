import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const deleteProductMock = vi.fn();
vi.mock("../actions", () => ({ deleteProduct: deleteProductMock }));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const { DeleteProductModal } = await import("./DeleteProductModal");

const PRODUCT = { id: "prod-1", name: "Truck Clean" };

describe("DeleteProductModal", () => {
  beforeEach(() => {
    deleteProductMock.mockReset();
    refreshMock.mockReset();
  });

  it("não renderiza nada quando open=false", () => {
    render(<DeleteProductModal product={PRODUCT} open={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exibe o diálogo de confirmação com scrim quando open=true", () => {
    render(<DeleteProductModal product={PRODUCT} open onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/truck clean/i)).toBeInTheDocument();
  });

  it("confirma a exclusão, fecha o modal e atualiza a listagem", async () => {
    deleteProductMock.mockResolvedValue({ success: true, data: undefined });
    const onClose = vi.fn();

    render(<DeleteProductModal product={PRODUCT} open onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: /excluir/i }));

    expect(deleteProductMock).toHaveBeenCalledWith("prod-1");
    expect(onClose).toHaveBeenCalled();
    expect(refreshMock).toHaveBeenCalled();
  });
});
