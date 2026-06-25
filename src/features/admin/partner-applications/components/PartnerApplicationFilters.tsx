"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type PartnerApplicationFiltersProps = {
  search: string;
  documentType: string;
};

export function PartnerApplicationFilters({ search, documentType }: PartnerApplicationFiltersProps) {
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
        placeholder="Buscar por razão social…"
        defaultValue={search}
        onChange={(e) => updateParam("search", e.target.value)}
        className="h-9 rounded-md border border-navy-border bg-navy-deeper px-3 font-body text-sm text-white placeholder:text-muted-text focus:border-nerta-blue focus:outline-none focus:ring-2 focus:ring-nerta-blue/30"
      />

      <select
        defaultValue={documentType}
        onChange={(e) => updateParam("type", e.target.value)}
        className="h-9 cursor-pointer rounded-md border border-navy-border bg-navy-deeper px-3 font-body text-sm text-white focus:border-nerta-blue focus:outline-none focus:ring-2 focus:ring-nerta-blue/30"
      >
        <option value="">Todos os tipos</option>
        <option value="cpf" className="bg-navy-light">Pessoa Física</option>
        <option value="cnpj" className="bg-navy-light">Pessoa Jurídica</option>
      </select>
    </div>
  );
}
