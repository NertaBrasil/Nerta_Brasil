import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { KpiStat } from "@/shared/components/ui/KpiStat";
import { AccentBlock } from "@/shared/components/ui/Card";
import { getFeaturedProducts, FeaturedSection } from "@/features/products";
import { PartnerButton } from "@/features/partner-applications";

function PartnerCTASection() {
  return (
    <section className="border-y border-navy-border bg-navy-deeper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-10">
        <div className="max-w-xl">
          <div className="text-label font-medium uppercase tracking-label text-provisao-gold">
            Programa de Parceiros
          </div>
          <h2 className="mt-3 text-h2">Agente Nerta no Brasil</h2>
          <p className="mt-4 text-sm leading-body text-muted-text">
            Selecionamos agentes e revendedores que compartilham o padrão técnico da marca.
            Preencha o formulário — nossa equipe analisa e entra em contato.
          </p>
          <div className="mt-8">
            <PartnerButton />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,_var(--color-navy-deep)_0%,_var(--color-navy-light)_100%)] px-4 py-16 sm:px-10 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(60% 120% at 78% 10%, #5BB8F5 0%, transparent 55%), radial-gradient(50% 100% at 10% 90%, #1DB87E 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Badge tone="gold">Química Automotiva Premium</Badge>
          <h1 className="mt-5 text-h1 sm:text-hero">
            Tecnologia química europeia de alta performance.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-body text-muted-text">
            Detergentes concentrados para frotas, agro e detailing — o menor custo real por
            lavagem do mercado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/produtos" size="lg">
              Explorar catálogo
            </Button>
            <Button href="#tecnologia" variant="secondary" size="lg">
              A tecnologia
            </Button>
            <PartnerButton />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-x-14 gap-y-7 sm:mt-20">
          <KpiStat value="50+" label="anos de tecnologia belga" tone="teal" />
          <KpiStat value="60+" label="países atendidos" tone="blue" />
          <KpiStat value="3–5%" label="diluição superconcentrada" tone="teal" />
          <KpiStat value="ISO" label="9001 · 14001 certificada" tone="blue" />
        </div>
      </div>
    </section>
  );
}

function TechSection() {
  return (
    <section id="tecnologia" className="border-y border-navy-border bg-navy-deeper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-10">
        <div>
          <div className="text-label font-medium uppercase tracking-label text-provisao-gold">
            Por que Nerta
          </div>
          <h2 className="mt-3 text-h2">Química de laboratório, não de prateleira</h2>
          <p className="mt-4 max-w-md text-sm leading-body text-muted-text">
            Fórmulas nano-moleculares desenvolvidas em laboratórios belgas. Cada produto é
            superconcentrado — você dilui de 3 a 20%, reduzindo o custo real por lavagem muito
            abaixo das soluções nacionais.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <AccentBlock accent="blue" title="Alta performance alcalina">
            Dissolve incrustações severas de frotas e máquinas agrícolas sem esfregação.
          </AccentBlock>
          <AccentBlock accent="teal" title="Tecnologia touchless real">
            Preserva pinturas modernas e películas, eliminando riscos mecânicos.
          </AccentBlock>
          <AccentBlock accent="gold" title="Distribuição exclusiva no Brasil">
            Importação oficial, estoque nacional e suporte técnico especializado.
          </AccentBlock>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      <HeroSection />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-10">
        <FeaturedSection products={featuredProducts} />
      </section>
      <div className="border-y border-navy-border bg-navy-deeper py-3.5">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 sm:px-10">
          <span className="font-body text-xs text-muted-text">
            Distribuição exclusiva no Brasil por
          </span>
          <div className="h-3.5 w-px bg-navy-border" />
          <span className="font-display text-sm font-extrabold leading-none tracking-tight text-provisao-gold">
            provisão
          </span>
          <span className="font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-text">
            Comércio Internacional
          </span>
        </div>
      </div>
      <PartnerCTASection />
      <TechSection />
    </main>
  );
}
