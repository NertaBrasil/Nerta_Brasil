"use client";

import { Button } from "@/shared/components/ui/Button";
import { trackBuyClick } from "@/infrastructure/analytics";
import type { PurchaseMode } from "../types";

type BuyButtonProps = {
  slug: string;
  stock: number;
  mlUrl: string | null;
  purchaseMode?: PurchaseMode;
};

export function BuyButton({ slug, stock, mlUrl, purchaseMode = "mercado_livre" }: BuyButtonProps) {
  if (purchaseMode === "formulario_parceria") {
    return (
      <Button variant="primary" size="lg" fullWidth href={`/produtos/${slug}/parceria`}>
        Quero ser parceiro Nerta Brasil
      </Button>
    );
  }

  const isAvailable = stock > 0 && Boolean(mlUrl);

  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      disabled={!isAvailable}
      disabledLabel="Produto Indisponível"
      href={isAvailable ? (mlUrl as string) : undefined}
      external
      onClick={() => trackBuyClick(slug)}
    >
      Comprar no Mercado Livre
    </Button>
  );
}
