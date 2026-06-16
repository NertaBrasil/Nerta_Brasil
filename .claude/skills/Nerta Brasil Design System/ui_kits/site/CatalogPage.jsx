// Catalog page — line filters + responsive product grid.
const NCP = window.NertaBrasilDesignSystem_82f464;

function CatalogPage({ onOpenProduct }) {
  const { ProductCard } = NCP;
  const mob = window.useIsMobile();
  const products = window.NERTA_PRODUCTS.filter((p) => p.active);
  const lines = window.NERTA_LINES;
  const [line, setLine] = React.useState('Todas');

  const shown = line === 'Todas'
    ? products
    : products.filter((p) => p.attributes.includes(line) || p.line.includes(line));

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '40px 20px 64px' : '56px 40px 80px' }}>
      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sky-blue)', marginBottom: 10 }}>Catálogo · Brasil 2026</div>
      <h1 style={{ fontSize: mob ? 28 : 34, marginBottom: 8 }}>Detergentes concentrados</h1>
      <p style={{ fontSize: 14, color: 'var(--muted-text)', maxWidth: 540, marginBottom: 30 }}>
        Bombonas de 25L para frotas, agro e detailing. Checkout direto no Mercado Livre.
      </p>

      {/* filter chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        {lines.map((l) => {
          const on = l === line;
          return (
            <button key={l} onClick={() => setLine(l)} style={{
              height: 34, padding: '0 16px', borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              letterSpacing: '0.02em',
              background: on ? 'var(--nerta-blue)' : 'transparent',
              color: on ? '#fff' : 'var(--muted-text)',
              border: on ? '1px solid transparent' : '1px solid var(--border-subtle)',
              transition: 'all var(--duration-fast)',
            }}>{l}</button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: mob ? 12 : 22 }}>
        {shown.map((p) => (
          <ProductCard key={p.slug} {...p} onBuy={() => {}} style={{ cursor: 'pointer' }}
            onClick={() => onOpenProduct(p.slug)} />
        ))}
      </div>
    </div>
  );
}
window.CatalogPage = CatalogPage;
