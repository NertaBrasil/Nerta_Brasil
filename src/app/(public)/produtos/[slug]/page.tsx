import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, ProductGallery, ProductSpecs, BuyButton } from "@/features/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description =
    product.short_description ??
    `${product.name} — química automotiva premium Nerta Brasil.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Nerta Brasil`,
      description,
      images: product.cover_image ? [{ url: product.cover_image.url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-text">{product.line}</p>
            <h1 className="text-h1">{product.name}</h1>
            {product.category && (
              <p className="mt-1 text-sm text-muted-text">{product.category.name}</p>
            )}
          </div>

          <ProductSpecs dilution={product.dilution} attributes={product.attributes} />

          {product.description && (
            <p className="text-base leading-body text-light-gray">{product.description}</p>
          )}

          <div className="mt-2">
            <BuyButton
              slug={product.slug}
              stock={product.stock}
              mlUrl={product.ml_url}
              purchaseMode={product.purchase_mode}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
