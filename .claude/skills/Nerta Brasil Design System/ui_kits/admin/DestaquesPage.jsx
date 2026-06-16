// /admin/destaques — featured products management.
const NDQ = window.NertaBrasilDesignSystem_82f464;

function DestaquesPage() {
  const { Badge } = NDQ;
  const Switch = window.Switch;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_PRODUCTS);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const count = rows.filter((p) => p.featured).length;
  const toggle = (id) => setRows((r) => r.map((p) => p.id === id ? { ...p, featured: !p.featured } : p));

  return (
    <div style={{ maxWidth: 860 }}>
      {/* counter banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', marginBottom: 22, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--provisao-gold)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'var(--gold-soft)', color: 'var(--provisao-gold)', flex: 'none' }}>
          <i data-lucide="star" style={{ width: 26, height: 26, fill: 'currentColor' }}></i>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--white)', lineHeight: 1 }}>{count}</div>
          <div style={{ fontSize: 13, color: 'var(--muted-text)', marginTop: 4 }}>{count} produtos aparecem no carrossel da home</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
        {rows.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--surface-card)', border: '1px solid ' + (p.featured ? 'rgba(201,149,26,0.4)' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 46, height: 46, flex: 'none', borderRadius: 'var(--radius-sm)', background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-border)' }}>
              <i data-lucide={p.icon} style={{ width: 22, height: 22 }}></i>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                {p.featured && <Badge tone="gold" solid>Destaque</Badge>}
              </div>
              <div style={{ color: 'var(--muted-text)', fontSize: 12, marginTop: 3 }}>{p.category}</div>
            </div>
            <Switch checked={p.featured} onChange={() => toggle(p.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
window.DestaquesPage = DestaquesPage;
