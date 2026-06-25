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
      <h1 className="text-h1">Solicitar {product.name}</h1>
      <p className="mt-2 text-base text-light-gray">
        Preencha o formulário abaixo para comprar este produto ou se tornar um parceiro Nerta Brasil.
        Atendemos tanto pessoas físicas quanto empresas — nossa equipe entrará em contato para
        finalizar o pedido.
      </p>

      <div className="mt-8">
        <PartnerApplicationForm productId={product.id} productName={product.name} />
      </div>
    </main>
  );
}
