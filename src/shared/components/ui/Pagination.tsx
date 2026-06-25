import Link from "next/link";
import { cn } from "@/shared/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string>;
};

function buildHref(searchParams: Record<string, string>, page: number) {
  const params = new URLSearchParams({ ...searchParams, page: String(page) });
  return `?${params.toString()}`;
}

export function Pagination({ page, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const linkClass =
    "flex h-9 min-w-[36px] items-center justify-center rounded-md border border-navy-border px-2.5 font-body text-sm transition-colors duration-fast";

  return (
    <nav aria-label="Paginação" className="flex items-center gap-1.5 pt-4">
      <Link
        href={buildHref(searchParams, page - 1)}
        aria-label="Página anterior"
        aria-disabled={!hasPrev}
        className={cn(
          linkClass,
          hasPrev
            ? "text-white hover:border-nerta-blue hover:text-nerta-blue"
            : "pointer-events-none text-muted-text opacity-40"
        )}
      >
        ←
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(searchParams, p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            linkClass,
            p === page
              ? "border-nerta-blue bg-nerta-blue/10 text-nerta-blue"
              : "text-white hover:border-nerta-blue hover:text-nerta-blue"
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(searchParams, page + 1)}
        aria-label="Próxima página"
        aria-disabled={!hasNext}
        className={cn(
          linkClass,
          hasNext
            ? "text-white hover:border-nerta-blue hover:text-nerta-blue"
            : "pointer-events-none text-muted-text opacity-40"
        )}
      >
        →
      </Link>
    </nav>
  );
}
