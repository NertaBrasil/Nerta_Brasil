import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const uploadProductImageMock = vi.fn();
const deleteProductImageMock = vi.fn();
const reorderProductImagesMock = vi.fn();
vi.mock("../actions", () => ({
  uploadProductImage: uploadProductImageMock,
  deleteProductImage: deleteProductImageMock,
  reorderProductImages: reorderProductImagesMock,
}));

vi.mock("../cropImage", () => ({
  cropImageToSquareBlob: vi.fn().mockResolvedValue(new Blob(["x"], { type: "image/png" })),
}));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const { ImageGallery } = await import("./ImageGallery");

const IMAGES = [
  {
    id: "img-1",
    product_id: "prod-1",
    storage_path: "products/prod-1/a.png",
    url: "https://cdn/a.png",
    position: 1,
    created_at: "2026-01-01",
  },
  {
    id: "img-2",
    product_id: "prod-1",
    storage_path: "products/prod-1/b.png",
    url: "https://cdn/b.png",
    position: 2,
    created_at: "2026-01-01",
  },
];

describe("ImageGallery", () => {
  beforeEach(() => {
    uploadProductImageMock.mockReset();
    deleteProductImageMock.mockReset();
    reorderProductImagesMock.mockReset();
    refreshMock.mockReset();
  });

  it("exibe a imagem de position 1 com o indicador 'Principal'", () => {
    render(<ImageGallery productId="prod-1" images={IMAGES} />);

    expect(screen.getAllByText(/principal/i)).toHaveLength(1);
    expect(screen.getByAltText("Imagem 1")).toHaveAttribute("src", "https://cdn/a.png");
  });

  it("ao reordenar via drag-and-drop, atualiza a 'Principal' e persiste a nova ordem", async () => {
    reorderProductImagesMock.mockResolvedValue({ success: true, data: undefined });
    render(<ImageGallery productId="prod-1" images={IMAGES} />);

    const items = screen.getAllByTestId("gallery-image");
    fireEvent.dragStart(items[1]);
    fireEvent.dragOver(items[0]);
    fireEvent.drop(items[0]);

    expect(reorderProductImagesMock).toHaveBeenCalledWith({
      product_id: "prod-1",
      image_ids: ["img-2", "img-1"],
    });
    expect(await screen.findByAltText("Imagem 1")).toHaveAttribute("src", "https://cdn/b.png");
  });

  it("ao excluir a imagem Principal, promove a próxima automaticamente", async () => {
    deleteProductImageMock.mockResolvedValue({ success: true, data: undefined });
    render(<ImageGallery productId="prod-1" images={IMAGES} />);

    const deleteButtons = screen.getAllByRole("button", { name: /excluir imagem/i });
    await userEvent.click(deleteButtons[0]);

    expect(deleteProductImageMock).toHaveBeenCalledWith("img-1");
    const remaining = screen.getAllByRole("img");
    expect(remaining).toHaveLength(1);
    expect(remaining[0]).toHaveAttribute("src", "https://cdn/b.png");
    expect(remaining[0]).toHaveAttribute("alt", "Imagem 1");
    expect(screen.getAllByText(/principal/i)).toHaveLength(1);
  });

  it("permite upload: seleciona arquivo, confirma o recorte, e adiciona a imagem à galeria", async () => {
    uploadProductImageMock.mockResolvedValue({
      success: true,
      data: {
        id: "img-3",
        product_id: "prod-1",
        storage_path: "products/prod-1/c.png",
        url: "https://cdn/c.png",
        position: 3,
        created_at: "2026-01-01",
      },
    });

    render(<ImageGallery productId="prod-1" images={IMAGES} />);

    const file = new File(["conteudo"], "foto.png", { type: "image/png" });
    const input = screen.getByLabelText(/adicionar imagem/i);
    await userEvent.upload(input, file);

    await userEvent.click(await screen.findByRole("button", { name: /confirmar recorte/i }));

    expect(uploadProductImageMock).toHaveBeenCalledWith("prod-1", expect.any(File));
    expect(await screen.findByAltText("Imagem 3")).toBeInTheDocument();
  });
});
