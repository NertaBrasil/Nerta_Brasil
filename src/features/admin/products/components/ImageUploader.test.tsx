import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { ImageUploader } = await import("./ImageUploader");

describe("ImageUploader", () => {
  it("rejeita arquivo não-imagem com mensagem clara, sem chamar onFileSelected", async () => {
    const onFileSelected = vi.fn();
    render(<ImageUploader onFileSelected={onFileSelected} />);

    const file = new File(["conteudo"], "documento.pdf", { type: "application/pdf" });
    const input = screen.getByLabelText(/adicionar imagem/i);

    await userEvent.upload(input, file);

    expect(onFileSelected).not.toHaveBeenCalled();
    expect(
      screen.getByText(/selecione um arquivo de imagem válido/i)
    ).toBeInTheDocument();
  });

  it("aceita arquivo de imagem válido e chama onFileSelected", async () => {
    const onFileSelected = vi.fn();
    render(<ImageUploader onFileSelected={onFileSelected} />);

    const file = new File(["conteudo"], "foto.png", { type: "image/png" });
    const input = screen.getByLabelText(/adicionar imagem/i);

    await userEvent.upload(input, file);

    expect(onFileSelected).toHaveBeenCalledWith(file, expect.any(String));
    expect(screen.queryByText(/selecione um arquivo de imagem válido/i)).not.toBeInTheDocument();
  });
});
