import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";
import { getFeaturedProducts, FeaturedSection } from "@/features/products";

function InstitutionalSection() {
  return (
    <section className="max-w-2xl">
      <Badge tone="gold">Química Automotiva Premium</Badge>
      <h1 className="mt-4 text-h1">Tecnologia química europeia de alta performance.</h1>
      <p className="mt-4 text-base leading-body text-muted-text">
        Detergentes concentrados para frotas, agro e detailing — o menor custo real por lavagem
        do mercado.
      </p>
      <Link
        href="/produtos"
        className="mt-6 inline-flex h-13 items-center justify-center rounded-full bg-nerta-blue px-[30px] font-display text-lg font-bold leading-none tracking-[-0.01em] text-white transition-colors duration-fast ease-standard hover:bg-nerta-blue-hover active:scale-[0.97]"
      >
        Explorar catálogo
      </Link>
    </section>
  );
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <InstitutionalSection />

      <div className="mt-16">
        <FeaturedSection products={featuredProducts} />
      </div>
    </main>
  );
}
