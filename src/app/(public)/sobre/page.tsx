import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { KpiStat } from "@/shared/components/ui/KpiStat";

const SCIENCE_STEPS = [
  {
    number: "01",
    title: "Fórmulas nano-moleculares",
    description:
      "Moléculas ativas dimensionadas para penetrar sujidade pesada — graxa, óleo e incrustação — sem depender de força mecânica.",
  },
  {
    number: "02",
    title: "Superconcentração real",
    description:
      "Cada litro concentrado rende de 20 a 30 litros de produto diluído, entre 3% e 5% — o menor custo real por lavagem do mercado.",
  },
  {
    number: "03",
    title: "Controle de qualidade em laboratório",
    description:
      "Cada lote é testado antes de sair da fábrica na Bélgica, garantindo a mesma performance em qualquer ponto de uso.",
  },
];

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
        <div className="relative mx-auto max-w-3xl">
          <Badge tone="blue">Sobre a Nerta</Badge>
          <h1 className="mt-5 text-h1 sm:text-hero">
            Mais de 50 anos formulando a química que move sua operação.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-body text-muted-text">
            Não vendemos detergente — entregamos fórmulas de laboratório desenvolvidas na Bélgica
            para resolver o problema real de quem lava frota, máquina agrícola ou veículo todos os
            dias.
          </p>
          <div className="mt-8">
            <Button href="/produtos" size="lg">
              Explorar catálogo
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-navy-border bg-navy-deeper">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-10">
          <div className="text-label font-medium uppercase tracking-label text-sky-blue">
            Nossa origem
          </div>
          <h2 className="mt-3 text-h2">Nossa história</h2>
          <p className="mt-4 text-sm leading-body text-muted-text">
            A Nerta nasceu na Bélgica desenvolvendo química de limpeza e proteção para operações
            que não podem parar — frotas de transporte, maquinário agrícola e linhas industriais.
            Décadas de pesquisa em laboratório levaram a fórmula a mais de 60 países, sempre com o
            mesmo princípio: concentração alta, diluição controlada e resultado consistente lote a
            lote.
          </p>
          <p className="mt-4 text-sm leading-body text-muted-text">
            Hoje, essa tecnologia chega ao Brasil com distribuição oficial e estoque nacional —
            sem perder o padrão técnico que sustenta a marca na Europa há mais de cinco décadas.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <div className="text-label font-medium uppercase tracking-label text-sky-blue">
              Tecnologia
            </div>
            <h2 className="mt-3 text-h2">A ciência por trás do produto</h2>
            <p className="mt-4 text-sm leading-body text-muted-text">
              O que diferencia um produto Nerta de uma química de prateleira está na molécula, na
              diluição e no controle — não no rótulo.
            </p>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {SCIENCE_STEPS.map((step) => (
              <div key={step.number} className="flex flex-col gap-2">
                <span className="font-display text-[52px] font-bold leading-none tracking-headline text-sky-blue">
                  {step.number}
                </span>
                <h3 className="font-display text-base font-bold text-white">{step.title}</h3>
                <p className="text-sm leading-body text-muted-text">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-navy-border bg-navy-deeper px-4 py-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-label font-medium uppercase tracking-label text-sky-blue">
            Padrão de qualidade
          </div>
          <h2 className="mt-3 text-h2">Certificação que sustenta a operação</h2>
          <div className="mt-10 flex flex-wrap gap-x-14 gap-y-7">
            <KpiStat value="50+" label="anos de tecnologia belga" tone="teal" />
            <KpiStat value="60+" label="países atendidos" tone="blue" />
            <KpiStat value="3–5%" label="diluição superconcentrada" tone="teal" />
            <KpiStat value="ISO" label="9001 · 14001 certificada" tone="blue" />
          </div>
        </div>
      </section>
    </main>
  );
}
