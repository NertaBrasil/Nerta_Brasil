import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const trackBuyClickMock = vi.fn();
vi.mock("@/infrastructure/analytics", () => ({ trackBuyClick: trackBuyClickMock }));

const { BuyButton } = await import("./BuyButton");

describe("BuyButton", () => {
  beforeEach(() => {
    trackBuyClickMock.mockReset();
  });

  it("habilitado com target=_blank quando há estoque e ml_url", () => {
    render(<BuyButton slug="produto-x" stock={10} mlUrl="https://produto.mercadolivre.com.br/1" />);

    const link = screen.getByRole("link", { name: /comprar no mercado livre/i });
    expect(link).toHaveAttribute("href", "https://produto.mercadolivre.com.br/1");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("dispara trackBuyClick com o slug ao clicar no botão habilitado", async () => {
    render(<BuyButton slug="produto-x" stock={10} mlUrl="https://produto.mercadolivre.com.br/1" />);

    await userEvent.click(screen.getByRole("link", { name: /comprar no mercado livre/i }));

    expect(trackBuyClickMock).toHaveBeenCalledWith("produto-x");
  });

  it("desabilitado com 'Produto Indisponível' e sem link quando stock = 0", () => {
    render(<BuyButton slug="produto-x" stock={0} mlUrl="https://produto.mercadolivre.com.br/1" />);

    expect(screen.getByText("Produto Indisponível")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("desabilitado quando ml_url está ausente mesmo com estoque disponível", () => {
    render(<BuyButton slug="produto-x" stock={10} mlUrl={null} />);

    expect(screen.getByText("Produto Indisponível")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("usa o comportamento padrão (link ML) quando purchaseMode não é informado", () => {
    render(<BuyButton slug="produto-x" stock={10} mlUrl="https://produto.mercadolivre.com.br/1" />);

    expect(screen.getByRole("link", { name: /comprar no mercado livre/i })).toBeInTheDocument();
  });

  it("navega internamente para o Formulário de Parceria quando purchaseMode = 'formulario_parceria', mesmo sem estoque", async () => {
    render(
      <BuyButton
        slug="produto-x"
        stock={0}
        mlUrl={null}
        purchaseMode="formulario_parceria"
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/produtos/produto-x/parceria");
    expect(link).not.toHaveAttribute("target");

    await userEvent.click(link);
    expect(trackBuyClickMock).not.toHaveBeenCalled();
  });

  it("preserva o comportamento de link ML quando purchaseMode = 'mercado_livre' explicitamente", () => {
    render(
      <BuyButton
        slug="produto-x"
        stock={10}
        mlUrl="https://produto.mercadolivre.com.br/1"
        purchaseMode="mercado_livre"
      />
    );

    const link = screen.getByRole("link", { name: /comprar no mercado livre/i });
    expect(link).toHaveAttribute("target", "_blank");
  });
});
