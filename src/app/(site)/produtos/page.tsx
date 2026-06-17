import { getProducts, ProductGrid } from "@/features/produtos";

export default async function ProdutosPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-h1">Catálogo de Produtos</h1>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
