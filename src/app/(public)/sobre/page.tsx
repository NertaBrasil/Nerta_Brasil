import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { KpiStat } from "@/shared/components/ui/KpiStat";
import { AccentBlock } from "@/shared/components/ui/Card";

export default function AboutPage() {
  return (
    <main>
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
            <Badge tone="blue">Sobre a Nerta</Badge>
            <h1 className="mt-5 text-h1 sm:text-hero">
              Química automotiva belga, pensada para o uso intensivo brasileiro.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-body text-muted-text">
              Desenvolvemos fórmulas nano-moleculares superconcentradas para frotas, agro e
              detailing — tecnologia europeia adaptada à realidade operacional do Brasil.
            </p>
            <div className="mt-8">
              <Button href="/produtos" size="lg">
                Explorar catálogo
              </Button>
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

      <section className="border-y border-navy-border bg-navy-deeper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-10">
          <div>
            <div className="text-label font-medium uppercase tracking-label text-sky-blue">
              Nossa origem
            </div>
            <h2 className="mt-3 text-h2">Mais de cinco décadas de química de laboratório</h2>
            <p className="mt-4 max-w-md text-sm leading-body text-muted-text">
              A Nerta nasceu na Bélgica desenvolvendo soluções de limpeza e proteção de alta
              performance para frotas, indústria e agricultura. Hoje, levamos essa tecnologia ao
              mercado brasileiro com produtos superconcentrados — você dilui de 3 a 20%, reduzindo
              o custo real por lavagem muito abaixo das soluções nacionais.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <AccentBlock accent="blue" title="Alta performance alcalina">
              Dissolve incrustações severas de frotas e máquinas agrícolas sem esfregação.
            </AccentBlock>
            <AccentBlock accent="teal" title="Tecnologia touchless real">
              Preserva pinturas modernas e películas, eliminando riscos mecânicos.
            </AccentBlock>
            <AccentBlock accent="blue" title="Suporte técnico especializado">
              Estoque nacional e atendimento dedicado para frotas, agro e detailing.
            </AccentBlock>
          </div>
        </div>
      </section>
    </main>
  );
}
