"use client";

import { Button } from "@/shared/components/ui/Button";
import { trackBuyClick } from "@/infrastructure/analytics";

type BuyButtonProps = {
  slug: string;
  stock: number;
  mlUrl: string | null;
};

export function BuyButton({ slug, stock, mlUrl }: BuyButtonProps) {
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
