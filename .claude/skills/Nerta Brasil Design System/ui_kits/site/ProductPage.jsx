// Product detail page — image, dilution highlight, dilution table, ML CTA.
const NPP = window.NertaBrasilDesignSystem_82f464;

function ProductPage({ slug, onNav, onOpenProduct }) {
  const { Button, Badge, AccentBlock } = NPP;
  const mob = window.useIsMobile();
  const products = window.NERTA_PRODUCTS;
  const p = products.find((x) => x.slug === slug) || products[0];
  const outOfStock = p.stock === 0;
  const related = products.filter((x) => x.slug !== p.slug && x.active).slice(0, 3);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const dilutionRows = [
    { use: 'Sujeira leve · manutenção diária', ratio: '1:30', pct: '3%' },
    { use: 'Frotas e carrocerias', ratio: '1:20', pct: '5%' },
    { use: 'Incrustação severa · agro', ratio: '1:10', pct: '10%' },
  ];

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '24px 20px 64px' : '32px 40px 80px' }}>
      {/* breadcrumb */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: 'var(--muted-text)', marginBottom: 28, letterSpacing: '0.04em' }}>
        <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', color: 'var(--muted-text)', cursor: 'pointer', fontSize: 11 }}>Início</button>
        <span>/</span>
        <button onClick={() => onNav('catalog')} style={{ background: 'none', border: 'none', color: 'var(--muted-text)', cursor: 'pointer', fontSize: 11 }}>Catálogo</button>
        <span>/</span>
        <span style={{ color: 'var(--light-gray)' }}>{p.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? 28 : 52 }}>
        {/* IMAGE — floating product on navy, no shadow */}
        <div style={{
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
          background: 'radial-gradient(120% 90% at 50% 26%, #163258 0%, #0D1B2E 70%)',
          minHeight: mob ? 280 : 460, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 18, left: 18 }}><Badge tone="blue">{p.line}</Badge></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, color: 'var(--navy-border)' }}>
            <i data-lucide={p.icon} style={{ width: 64, height: 64 }}></i>
            <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Bombona 25L · foto do produto</span>
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <h1 style={{ fontSize: mob ? 28 : 36, lineHeight: 1.08 }}>{p.name}</h1>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--provisao-gold)', marginTop: 6 }}>{p.category}</div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '20px 0' }}>
            <Badge tone="blue" solid>{`Diluição ${p.dilution}`}</Badge>
            {p.attributes.map((a) => <Badge key={a} tone="teal">{a}</Badge>)}
          </div>

          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--muted-text)', maxWidth: 480 }}>{p.description}</p>

          {/* dilution table */}
          <div style={{ marginTop: 26, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ padding: '11px 16px', background: 'var(--surface-raised)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light-gray)' }}>Tabela de diluição</div>
            {dilutionRows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 13, color: 'var(--light-gray)' }}>{r.use}</span>
                <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--muted-text)' }}>{r.ratio}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--sky-blue)', minWidth: 36, textAlign: 'right' }}>{r.pct}</span>
                </span>
              </div>
            ))}
          </div>

          {/* cost anchor */}
          <div style={{ marginTop: 18 }}>
            <AccentBlock accent="teal" title="O menor custo real por lavagem">
              Superconcentrado: 1 bombona de 25L rende muito mais que detergentes nacionais diluídos de fábrica.
            </AccentBlock>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 28 }}>
            {outOfStock ? (
              <Button variant="primary" size="lg" fullWidth disabled disabledLabel="Produto Indisponível" />
            ) : (
              <Button variant="primary" size="lg" fullWidth href={p.mlUrl} external onClick={() => {}}
                rightIcon={<i data-lucide="external-link" style={{ width: 17, height: 17 }}></i>}>
                Comprar no Mercado Livre
              </Button>
            )}
            <div style={{ fontSize: 11, color: 'var(--muted-text)', textAlign: 'center', marginTop: 12 }}>
              {outOfStock ? 'Reposição em breve — fale com a Provisão.' : 'Checkout 100% seguro via Mercado Livre · abre em nova aba'}
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      <div style={{ marginTop: mob ? 52 : 72 }}>
        <h2 style={{ fontSize: 22, marginBottom: 22 }}>Outros produtos da linha</h2>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: mob ? 12 : 22 }}>
          {related.map((r) => (
            <NPP.ProductCard key={r.slug} {...r} onBuy={() => {}} style={{ cursor: 'pointer' }} onClick={() => onOpenProduct(r.slug)} />
          ))}
        </div>
      </div>
    </div>
  );
}
window.ProductPage = ProductPage;
