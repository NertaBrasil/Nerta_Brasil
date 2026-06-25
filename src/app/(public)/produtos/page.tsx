import type { Metadata } from "next";
import { getProducts, getCategories, ProductGrid, ProductFilters } from "@/features/products";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
  description:
    "Explore o catálogo completo de produtos Nerta Brasil: espumas, degreasers, produtos agrícolas, animal care e detailing de alta performance.",
};

type ProductsPageProps = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search } = await searchParams;
  const categories = await getCategories();
  const categorySlug = categories.some((c) => c.slug === category) ? category : undefined;
  const searchTerm = search && search.trim().length >= 2 ? search.trim() : undefined;

  const products = await getProducts({ category_slug: categorySlug, search: searchTerm });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-h1">Catálogo de Produtos</h1>
      <div className="mt-6">
        <ProductFilters categories={categories} />
      </div>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
