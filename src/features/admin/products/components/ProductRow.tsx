"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProductSummary } from "@/features/products";
import { toggleFeatured } from "@/features/admin/featured";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { toggleProductActive } from "../actions";
import { DeleteProductModal } from "./DeleteProductModal";

type ProductRowProps = {
  product: ProductSummary;
};

export function ProductRow({ product }: ProductRowProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [featuredPending, setFeaturedPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleToggle() {
    setPending(true);
    await toggleProductActive(product.id, !product.active);
    setPending(false);
    router.refresh();
  }

  async function handleToggleFeatured() {
    setFeaturedPending(true);
    await toggleFeatured(product.id, !product.featured);
    setFeaturedPending(false);
    router.refresh();
  }

  return (
    <tr className="border-b border-navy-border">
      <td className="py-3 font-body text-sm text-white">{product.name}</td>
      <td className="py-3 font-body text-sm text-muted-text">{product.category?.name ?? "—"}</td>
      <td className="py-3 font-body text-sm text-muted-text">{product.stock}</td>
      <td className="py-3">
        <Badge tone={product.active ? "teal" : "neutral"}>
          {product.active ? "Ativo" : "Inativo"}
        </Badge>
      </td>
      <td className="py-3 text-right">
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/produtos/${product.id}`}
            className="font-body text-sm font-medium text-sky-blue hover:underline"
          >
            Editar
          </Link>
          <Button variant="ghost" size="sm" disabled={pending} onClick={handleToggle}>
            {product.active ? "Desativar" : "Ativar"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={featuredPending}
            onClick={handleToggleFeatured}
          >
            {product.featured ? "Remover destaque" : "Destacar"}
          </Button>
          <Button variant="danger-ghost" size="sm" onClick={() => setDeleteOpen(true)}>
            Excluir
          </Button>
        </div>
        <DeleteProductModal product={product} open={deleteOpen} onClose={() => setDeleteOpen(false)} />
      </td>
    </tr>
  );
}
