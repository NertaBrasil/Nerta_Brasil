import { getCategories } from "@/features/products";
import { ProductForm } from "@/features/admin/products";
import { BackLink } from "@/shared/components/ui/BackLink";

export default async function AdminNewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <BackLink href="/admin/produtos" label="Voltar para produtos" />
      <h1 className="mt-3 text-h2">Novo produto</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
