import { ProductCard } from "./ProductCard";
import type { ProductSummary } from "../types";

type FeaturedSectionProps = {
  products: ProductSummary[];
};

export function FeaturedSection({ products }: FeaturedSectionProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-h2">Destaques</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
