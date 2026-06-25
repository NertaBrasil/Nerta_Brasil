"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Category } from "@/features/products";

type ProductFiltersProps = {
  categories: Category[];
  search: string;
  categorySlug: string;
  status: string;
};

export function ProductFilters({ categories, search, categorySlug, status }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3 pb-4">
      <input
        type="search"
        placeholder="Buscar por nome…"
        defaultValue={search}
        onChange={(e) => updateParam("search", e.target.value)}
        className="h-9 rounded-md border border-navy-border bg-navy-deeper px-3 font-body text-sm text-white placeholder:text-muted-text focus:border-nerta-blue focus:outline-none focus:ring-2 focus:ring-nerta-blue/30"
      />

      <select
        defaultValue={categorySlug}
        onChange={(e) => updateParam("category", e.target.value)}
        className="h-9 cursor-pointer rounded-md border border-navy-border bg-navy-deeper px-3 font-body text-sm text-white focus:border-nerta-blue focus:outline-none focus:ring-2 focus:ring-nerta-blue/30"
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug} className="bg-navy-light">
            {c.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={status}
        onChange={(e) => updateParam("status", e.target.value)}
        className="h-9 cursor-pointer rounded-md border border-navy-border bg-navy-deeper px-3 font-body text-sm text-white focus:border-nerta-blue focus:outline-none focus:ring-2 focus:ring-nerta-blue/30"
      >
        <option value="">Todos os status</option>
        <option value="active" className="bg-navy-light">Ativo</option>
        <option value="inactive" className="bg-navy-light">Inativo</option>
      </select>
    </div>
  );
}
