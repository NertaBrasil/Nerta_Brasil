import { afterEach, describe, expect, it, vi } from "vitest";
import { trackBuyClick } from "./analytics";

afterEach(() => {
  delete window.gtag;
  delete window.fbq;
});

describe("trackBuyClick", () => {
  it("dispara o evento GA4 com o slug do produto", () => {
    window.gtag = vi.fn();
    window.fbq = vi.fn();

    trackBuyClick("produto-disponivel");

    expect(window.gtag).toHaveBeenCalledWith("event", "comprar_ml", {
      slug: "produto-disponivel",
    });
  });

  it("dispara o evento Meta Pixel InitiateCheckout", () => {
    window.gtag = vi.fn();
    window.fbq = vi.fn();

    trackBuyClick("produto-disponivel");

    expect(window.fbq).toHaveBeenCalledWith("track", "InitiateCheckout");
  });

  it("não lança erro quando gtag/fbq ainda não foram carregados", () => {
    expect(() => trackBuyClick("produto-disponivel")).not.toThrow();
  });
});
