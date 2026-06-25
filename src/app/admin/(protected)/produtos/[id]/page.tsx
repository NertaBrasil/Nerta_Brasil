import { notFound } from "next/navigation";
import { getCategories } from "@/features/products";
import { ProductForm, ImageGallery, getProductById } from "@/features/admin/products";
import { BackLink } from "@/shared/components/ui/BackLink";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);

  if (!product) notFound();

  return (
    <div>
      <BackLink href="/admin/produtos" label="Voltar para produtos" />
      <h1 className="mt-3 text-h2">Editar produto</h1>
      <div className="mt-6">
        <ProductForm categories={categories} product={product} />
      </div>
      <div className="mt-10">
        <h2 className="text-h3">Imagens</h2>
        <div className="mt-4">
          <ImageGallery productId={product.id} images={product.images} />
        </div>
      </div>
    </div>
  );
}
