import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const deleteUserMock = vi.fn();
vi.mock("../actions", () => ({ deleteUser: deleteUserMock }));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const { DeleteUserModal } = await import("./DeleteUserModal");

const USER = { id: "user-1", name: "Editor Teste" };

describe("DeleteUserModal", () => {
  beforeEach(() => {
    deleteUserMock.mockReset();
    refreshMock.mockReset();
  });

  it("não renderiza nada quando open=false", () => {
    render(<DeleteUserModal user={USER} open={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exibe o diálogo de confirmação com scrim quando open=true", () => {
    render(<DeleteUserModal user={USER} open onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/editor teste/i)).toBeInTheDocument();
  });

  it("confirma a exclusão, fecha o modal e atualiza a listagem", async () => {
    deleteUserMock.mockResolvedValue({ success: true, data: undefined });
    const onClose = vi.fn();

    render(<DeleteUserModal user={USER} open onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: /excluir/i }));

    expect(deleteUserMock).toHaveBeenCalledWith("user-1");
    expect(onClose).toHaveBeenCalled();
    expect(refreshMock).toHaveBeenCalled();
  });
});
