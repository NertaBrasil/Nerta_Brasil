import { notFound } from "next/navigation";
import { getCategories } from "@/features/products";
import { ProductForm, ImageGallery, getProductById } from "@/features/admin/products";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-h2">Editar produto</h1>
      <div className="mt-6 max-w-xl">
        <ProductForm categories={categories} product={product} />
      </div>
      <div className="mt-10 max-w-xl">
        <h2 className="text-h3">Imagens</h2>
        <div className="mt-4">
          <ImageGallery productId={product.id} images={product.images} />
        </div>
      </div>
    </div>
  );
}
