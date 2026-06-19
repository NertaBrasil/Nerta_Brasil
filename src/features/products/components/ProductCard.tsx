import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import type { ProductSummary } from "../types";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  const isUnavailable = product.stock === 0;

  return (
    <Link href={`/produtos/${product.slug}`} className="block h-full">
      <Card accent="blue" interactive padding="4" className="flex h-full flex-col">
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-navy-deeper">
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
          {isUnavailable && (
            <div className="absolute left-3 top-3">
              <Badge tone="neutral">Indisponível</Badge>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2">
          <h3 className="text-h4">{product.name}</h3>
          <p className="text-sm text-muted-text">{product.line}</p>
          {product.short_description && (
            <p className="line-clamp-2 text-sm text-muted-text">{product.short_description}</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
