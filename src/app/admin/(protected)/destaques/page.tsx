import { FeaturedGrid, getFeaturedProductsForAdmin } from "@/features/admin/featured";

export default async function AdminFeaturedPage() {
  const products = await getFeaturedProductsForAdmin();

  return (
    <div>
      <h1 className="text-h2">Destaques</h1>
      <p className="mt-1 font-body text-sm text-muted-text">
        Produtos exibidos na seção de destaques da home pública, na ordem definida aqui.
      </p>

      <div className="mt-6">
        <FeaturedGrid products={products} />
      </div>
    </div>
  );
}
