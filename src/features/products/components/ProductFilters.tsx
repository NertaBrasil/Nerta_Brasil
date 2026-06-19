"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/shared/utils";
import type { Category } from "../types";

type ProductFiltersProps = {
  categories: Category[];
};

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("category");

  function selectCategory(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
      <FilterChip active={!activeSlug} onClick={() => selectCategory(null)}>
        Todas as categorias
      </FilterChip>
      {categories.map((category) => (
        <FilterChip
          key={category.id}
          active={activeSlug === category.slug}
          onClick={() => selectCategory(category.slug)}
        >
          {category.name}
        </FilterChip>
      ))}
    </div>
  );
}

type FilterChipProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-base ease-standard",
        active
          ? "border-sky-blue bg-sky-blue text-white"
          : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}
