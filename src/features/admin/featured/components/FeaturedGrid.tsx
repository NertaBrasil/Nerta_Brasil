"use client";

import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import type { FeaturedProduct } from "../queries";
import { reorderFeatured, toggleFeatured } from "../actions";

type FeaturedGridProps = {
  products: FeaturedProduct[];
};

export function FeaturedGrid({ products: initialProducts }: FeaturedGridProps) {
  const router = useRouter();
  const [products, setProducts] = useState(() =>
    [...initialProducts].sort((a, b) => a.featured_position - b.featured_position)
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <p className="font-body text-sm text-muted-text">
        Nenhum produto está marcado como destaque no momento.
      </p>
    );
  }

  function handleDragStart(index: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      setDraggedIndex(index);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    };
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  async function persistReorder(reordered: FeaturedProduct[]) {
    const result = await reorderFeatured({ productIds: reordered.map((product) => product.id) });
    if (!result.success) setError(result.error);
  }

  function handleDrop(targetIndex: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (draggedIndex === null || draggedIndex === targetIndex) return;

      const reordered = [...products];
      const [moved] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, moved);

      setProducts(reordered);
      setDraggedIndex(null);
      void persistReorder(reordered);
    };
  }

  async function handleRemove(productId: string) {
    const result = await toggleFeatured(productId, false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setProducts((current) => current.filter((product) => product.id !== productId));
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <span className="font-body text-xs text-[#E5634D]">{error}</span>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            data-testid="featured-item"
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={handleDrop(index)}
          >
            <Card accent="blue" padding="4" className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-h4">{product.name}</h3>
                <Badge tone={product.active ? "teal" : "neutral"}>
                  {product.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <button
                type="button"
                aria-label="Remover destaque"
                onClick={() => handleRemove(product.id)}
                className="self-start font-body text-xs text-[#E5634D] hover:underline"
              >
                Remover destaque
              </button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
