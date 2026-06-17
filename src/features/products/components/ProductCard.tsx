import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import type { ProductSummary } from "../types";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  const isUnavailable = product.stock === 0;

  return (
    <Card accent="blue" interactive padding="4">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-navy-deeper">
        {product.cover_image ? (
          <img
            src={product.cover_image.url}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div
            data-testid="product-card-image-placeholder"
            className="flex h-full w-full items-center justify-center text-sm text-muted-text"
          >
            Sem imagem
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {isUnavailable && <Badge tone="neutral">Indisponível</Badge>}
        <h3 className="text-h4">{product.name}</h3>
        <p className="text-sm text-muted-text">{product.line}</p>
        {product.short_description && (
          <p className="text-sm text-muted-text">{product.short_description}</p>
        )}
      </div>
    </Card>
  );
}
