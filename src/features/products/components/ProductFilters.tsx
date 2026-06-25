"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, type ReactNode } from "react";
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
  const activeSearch = searchParams.get("search") ?? "";

  const buildHref = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(overrides)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams]
  );

  function selectCategory(slug: string | null) {
    router.push(buildHref({ category: slug, page: null }));
  }

  function handleSearch(value: string) {
    router.push(buildHref({ search: value || null, page: null }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder="Buscar produto…"
          defaultValue={activeSearch}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length === 0 || val.length >= 2) handleSearch(val);
          }}
          aria-label="Buscar produto"
          className="w-full rounded-lg border border-white/20 bg-navy-mid py-2.5 pl-9 pr-4 font-body text-sm text-white placeholder-muted-text transition-colors duration-base focus:border-nerta-blue focus:outline-none focus:ring-1 focus:ring-nerta-blue"
        />
      </div>

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
