import { notFound } from "next/navigation";
import { getProductBySlug } from "@/features/products";
import { PartnerApplicationForm } from "@/features/partner-applications";

type PartnerApplicationPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PartnerApplicationPage({ params }: PartnerApplicationPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm text-muted-text">{product.line}</p>
      <h1 className="text-h1">Programa de Qualificação de Parceiros</h1>
      <p className="mt-2 text-base text-light-gray">
        Candidatura para <strong>{product.name}</strong>
      </p>

      <div className="mt-8">
        <PartnerApplicationForm productId={product.id} productName={product.name} />
      </div>
    </main>
  );
}
