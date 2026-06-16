// Landing page — hero, KPIs, featured carousel, tech section.
const NLP = window.NertaBrasilDesignSystem_82f464;

function LandingPage({ onNav, onOpenProduct }) {
  const { Button, Badge, KpiStat, ProductCard, AccentBlock } = NLP;
  const mob = window.useIsMobile();
  const products = window.NERTA_PRODUCTS;
  const featured = products.filter((p) => p.featured && p.active);

  return (
    <div>
      {/* HERO */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--bg-gradient)',
        padding: mob ? '52px 20px 60px' : '92px 40px 104px',
      }}>
        {/* subtle foam/wave texture ≤8% opacity */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
          background: 'radial-gradient(60% 120% at 78% 10%, #5BB8F5 0%, transparent 55%), radial-gradient(50% 100% at 10% 90%, #1DB87E 0%, transparent 55%)',
        }} />
        <div style={{ position: 'relative', maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ maxWidth: 720 }}>
            <Badge tone="gold">Lançamento Nacional · Brasil 2026</Badge>
            <h1 style={{ fontSize: mob ? 32 : 54, lineHeight: 1.06, margin: '22px 0 0', maxWidth: 700 }}>
              Tecnologia química <span style={{ color: 'var(--sky-blue)' }}>europeia</span> de alta performance.
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--muted-text)', margin: '22px 0 0', maxWidth: 560 }}>
              Para um mercado que ainda utiliza soluções inferiores. Detergentes concentrados
              para frotas, agro e detailing — o menor custo real por lavagem do mercado.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 34, flexWrap: 'wrap' }}>
              <Button variant="primary" size={mob ? 'md' : 'lg'} onClick={() => onNav('catalog')}>Explorar catálogo</Button>
              <Button variant="secondary" size={mob ? 'md' : 'lg'} onClick={() => onNav('about')}>A tecnologia</Button>
            </div>
          </div>

          {/* KPI row */}
          <div style={{ display: 'flex', gap: mob ? '28px 40px' : 56, marginTop: mob ? 48 : 72, flexWrap: 'wrap' }}>
            <KpiStat value="50+" label="anos de tecnologia belga" tone="teal" />
            <KpiStat value="60+" label="países atendidos" tone="blue" />
            <KpiStat value="3–5%" label="diluição superconcentrada" tone="teal" />
            <KpiStat value="ISO" label="9001 · 14001 certificada" tone="blue" />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding: mob ? '48px 20px' : '72px 40px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sky-blue)', marginBottom: 10 }}>Produtos em destaque</div>
            <h2 style={{ fontSize: 30 }}>Linha premium 2026</h2>
          </div>
          <Button variant="ghost" onClick={() => onNav('catalog')}>Ver tudo →</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)', gap: 22 }}>
          {featured.map((p) => (
            <ProductCard key={p.slug} {...p} onBuy={() => {}} style={{ cursor: 'pointer' }}
              onClick={() => onOpenProduct(p.slug)} />
          ))}
        </div>
      </section>

      {/* TECH band */}
      <section style={{ background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '48px 20px' : '72px 40px', display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? 28 : 56, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--provisao-gold)', marginBottom: 12 }}>Por que Nerta</div>
            <h2 style={{ fontSize: 30, marginBottom: 18 }}>Química de laboratório, não de prateleira</h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted-text)', maxWidth: 460 }}>
              Fórmulas nano-moleculares desenvolvidas em laboratórios belgas. Cada produto é
              superconcentrado — você dilui de 3 a 20%, reduzindo o custo real por lavagem
              muito abaixo das soluções nacionais.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AccentBlock accent="blue" title="Alta performance alcalina">Dissolve incrustações severas de frotas e máquinas agrícolas sem esfregação.</AccentBlock>
            <AccentBlock accent="teal" title="Tecnologia touchless real">Preserva pinturas modernas e películas, eliminando riscos mecânicos.</AccentBlock>
            <AccentBlock accent="gold" title="Distribuição exclusiva Provisão">Importação oficial, estoque nacional e suporte técnico especializado.</AccentBlock>
          </div>
        </div>
      </section>
    </div>
  );
}
window.LandingPage = LandingPage;
