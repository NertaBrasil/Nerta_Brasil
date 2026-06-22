import { getCategories } from "@/features/products";
import { ProductForm } from "@/features/admin/products";

export default async function AdminNewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-h2">Novo produto</h1>
      <div className="mt-6 max-w-xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
