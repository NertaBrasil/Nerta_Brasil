import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const cropImageToSquareBlobMock = vi.fn();

vi.mock("../cropImage", () => ({
  cropImageToSquareBlob: cropImageToSquareBlobMock,
}));

const { ImageCropper } = await import("./ImageCropper");

describe("ImageCropper", () => {
  beforeEach(() => {
    cropImageToSquareBlobMock.mockReset();
  });

  it("não chama onConfirm automaticamente ao montar — exige confirmação explícita", () => {
    const onConfirm = vi.fn();
    render(<ImageCropper imageUrl="blob:fake" onConfirm={onConfirm} onCancel={vi.fn()} />);

    expect(onConfirm).not.toHaveBeenCalled();
    expect(cropImageToSquareBlobMock).not.toHaveBeenCalled();
  });

  it("ao confirmar, gera o blob recortado e chama onConfirm com ele", async () => {
    const blob = new Blob(["fake"], { type: "image/png" });
    cropImageToSquareBlobMock.mockResolvedValue(blob);
    const onConfirm = vi.fn();

    render(<ImageCropper imageUrl="blob:fake" onConfirm={onConfirm} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /confirmar recorte/i }));

    expect(cropImageToSquareBlobMock).toHaveBeenCalledWith("blob:fake");
    expect(onConfirm).toHaveBeenCalledWith(blob);
  });

  it("ao cancelar, chama onCancel sem gerar o recorte", async () => {
    const onCancel = vi.fn();
    render(<ImageCropper imageUrl="blob:fake" onConfirm={vi.fn()} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onCancel).toHaveBeenCalled();
    expect(cropImageToSquareBlobMock).not.toHaveBeenCalled();
  });
});
