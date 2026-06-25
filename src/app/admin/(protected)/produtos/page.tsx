import { Suspense } from "react";
import Link from "next/link";
import { getCategories } from "@/features/products";
import { ProductFilters } from "@/features/admin/products/components/ProductFilters";
import { ProductList } from "@/features/admin/products";

type SearchParams = Promise<{
  page?: string;
  search?: string;
  category?: string;
  status?: string;
}>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search ?? "";
  const categorySlug = params.category ?? "";
  const status = params.status ?? "";

  const categories = await getCategories();

  const rawSearchParams: Record<string, string> = {};
  if (search) rawSearchParams.search = search;
  if (categorySlug) rawSearchParams.category = categorySlug;
  if (status) rawSearchParams.status = status;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-h2">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="font-body text-sm font-medium text-sky-blue hover:underline"
        >
          + Novo produto
        </Link>
      </div>

      <div className="mt-6">
        <Suspense>
          <ProductFilters
            categories={categories}
            search={search}
            categorySlug={categorySlug}
            status={status}
          />
        </Suspense>

        <ProductList
          page={page}
          search={search}
          categorySlug={categorySlug}
          status={status}
          searchParams={rawSearchParams}
        />
      </div>
    </div>
  );
}
