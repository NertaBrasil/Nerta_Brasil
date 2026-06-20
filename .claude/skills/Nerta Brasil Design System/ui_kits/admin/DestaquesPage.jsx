// /admin/destaques — grade reordenável por drag-and-drop dos produtos em destaque.
// Refinamentos: DnD para reordenar, estado vazio claro, aviso sobre regra ativo+destaque,
// indicador de status em cada card (produtos inativos não aparecem na home mesmo se destacados).
const NDQ = window.NertaBrasilDesignSystem_82f464;

function DestaquesPage() {
  const { Badge } = NDQ;
  const mob = window.useIsMobile(900);

  // Separar destacados (ordenáveis) de não-destacados
  const [allRows, setAllRows] = React.useState(window.ADMIN_PRODUCTS);

  const featured = allRows.filter(p => p.featured);
  const notFeatured = allRows.filter(p => !p.featured);

  // Produtos que de fato aparecem na home (ativo + destaque)
  const publicVisible = featured.filter(p => p.active);

  const dragIdx = React.useRef(null);
  const [dragOver, setDragOver] = React.useState(null);
  const [initialLoading, setInitialLoading] = React.useState(true);

  React.useEffect(() => { setTimeout(() => setInitialLoading(false), 750); }, []);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const toggle = (id) => setAllRows(r => r.map(p => p.id === id ? { ...p, featured: !p.featured } : p));

  const onDragStart = (i) => { dragIdx.current = i; };
  const onDragOver = (e, i) => { e.preventDefault(); setDragOver(i); };
  const onDrop = (i) => {
    const from = dragIdx.current;
    if (from === null || from === i) { dragIdx.current = null; setDragOver(null); return; }
    const reordered = [...featured];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(i, 0, moved);
    // Rebuild allRows preserving non-featured
    const newAll = [...reordered, ...notFeatured];
    setAllRows(r => {
      const notFeaturedFromR = r.filter(p => !p.featured);
      return [...reordered, ...notFeaturedFromR];
    });
    dragIdx.current = null;
    setDragOver(null);
  };
  const onDragEnd = () => { dragIdx.current = null; setDragOver(null); };

  const ProductThumb = ({ icon, active }) => (
    <div style={{
      width: 46, height: 46, flex: 'none', borderRadius: 'var(--radius-sm)',
      background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)',
      border: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: active ? 'var(--sky-blue)' : 'var(--navy-border)',
      opacity: active ? 1 : 0.5,
    }}>
      <i data-lucide={icon} style={{ width: 22, height: 22 }}></i>
    </div>
  );

  if (initialLoading) return <window.LoadingSkeleton rows={4} type="cards" />;

  return (
    <div>
      <window.DemoBar actions={[
        { label: 'Estado vazio (sem destaques)', action: () => setAllRows(r => r.map(p => ({ ...p, featured: false }))) },
        { label: 'Produto inativo em destaque', action: () => setAllRows(r => r.map(p => p.id === 'p5' ? { ...p, featured: true } : p)) },
        { label: 'Restaurar dados', action: () => setAllRows(window.ADMIN_PRODUCTS) },
      ]} />

      {/* ── Aviso sobre regra ativo + destaque ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', marginBottom: 24,
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderLeft: '4px solid var(--provisao-gold)', borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-md)', background: 'rgba(201,149,26,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--provisao-gold)' }}>
          <i data-lucide="info" style={{ width: 18, height: 18 }}></i>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
            Somente produtos <strong style={{ color: 'var(--teal)' }}>ativos</strong> e <strong style={{ color: 'var(--provisao-gold)' }}>destacados</strong> aparecem no carrossel da home pública
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted-text)', lineHeight: 1.6 }}>
            {featured.length === 0
              ? 'Nenhum produto marcado como destaque.'
              : publicVisible.length === 0
              ? 'Nenhum produto marcado como destaque está ativo — o carrossel da home ficará vazio.'
              : publicVisible.length === featured.length
              ? featured.length + ' produto(s) em destaque estão ativos e aparecem na home.'
              : publicVisible.length + ' de ' + featured.length + ' produto(s) em destaque são ativos e aparecem na home. ' + (featured.length - publicVisible.length) + ' inativo(s) são ocultados automaticamente.'}
          </div>
        </div>
        <div style={{ textAlign: 'right', flex: 'none' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--provisao-gold)', lineHeight: 1 }}>{publicVisible.length}</div>
          <div style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>visíveis</div>
        </div>
      </div>

      {/* ── Seção: Ordem na home (drag-and-drop) ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, margin: 0 }}>Ordem no carrossel</h3>
          {featured.length > 0 && (
            <span style={{ fontSize: 11.5, color: 'var(--muted-text)' }}>
              <i data-lucide="grip-vertical" style={{ width: 12, height: 12, verticalAlign: 'middle' }}></i> Arraste para reordenar
            </span>
          )}
        </div>

        {featured.length === 0 ? (
          /* Estado vazio — nenhum produto destacado */
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '64px 20px',
            border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', textAlign: 'center',
          }}>
            <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-text)' }}>
              <i data-lucide="star" style={{ width: 28, height: 28 }}></i>
            </div>
            <div>
              <div style={{ fontSize: 17, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>Nenhum produto em destaque</div>
              <div style={{ fontSize: 13.5, color: 'var(--muted-text)', maxWidth: 360, lineHeight: 1.6 }}>
                Ative o toggle "Destaque na home" abaixo para que um produto apareça no carrossel da página principal.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {featured.map((p, i) => {
              const appearsOnHome = p.active;
              const isDragTarget = dragOver === i;
              return (
                <div key={p.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={() => onDrop(i)}
                  onDragEnd={onDragEnd}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
                    background: isDragTarget ? 'var(--surface-raised)' : 'var(--surface-card)',
                    border: '1px solid ' + (isDragTarget ? 'var(--nerta-blue)' : appearsOnHome ? 'rgba(201,149,26,0.35)' : 'var(--border-subtle)'),
                    borderRadius: 'var(--radius-md)', cursor: 'grab',
                    boxShadow: isDragTarget ? '0 0 0 2px rgba(91,184,245,0.2)' : 'none',
                    transition: 'all 0.12s',
                    opacity: appearsOnHome ? 1 : 0.65,
                  }}>
                  {/* Drag handle + posição */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                    <i data-lucide="grip-vertical" style={{ width: 16, height: 16, color: 'var(--border-strong)' }}></i>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--sky-blue)', width: 22, textAlign: 'right', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <ProductThumb icon={p.icon} active={p.active} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{p.name}</span>
                      <window.StatusPill active={p.active} />
                      {!appearsOnHome && (
                        <span style={{ fontSize: 11, color: '#E5A03D', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <i data-lucide="eye-off" style={{ width: 11, height: 11 }}></i>Não aparece na home
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--muted-text)', fontSize: 12, marginTop: 3 }}>{p.category}</div>
                  </div>

                  <button onClick={() => toggle(p.id)} title="Remover dos destaques"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', background: 'rgba(201,149,26,0.12)', border: '1px solid rgba(201,149,26,0.4)', borderRadius: 'var(--radius-pill)', color: 'var(--provisao-gold)', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, flex: 'none' }}>
                    <i data-lucide="star" style={{ width: 13, height: 13, fill: 'currentColor' }}></i>
                    {!mob && 'Remover'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Seção: Demais produtos ── */}
      {notFeatured.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, margin: 0, color: 'var(--muted-text)' }}>Outros produtos</h3>
            <span style={{ fontSize: 12, color: 'var(--muted-text)' }}>— ative o toggle para adicionar ao carrossel</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
            {notFeatured.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', opacity: p.active ? 1 : 0.6 }}>
                <ProductThumb icon={p.icon} active={p.active} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{p.name}</span>
                    <window.StatusPill active={p.active} />
                  </div>
                  <div style={{ color: 'var(--muted-text)', fontSize: 11.5, marginTop: 2 }}>{p.category}</div>
                </div>
                <button onClick={() => toggle(p.id)} title="Adicionar ao destaque"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 30, padding: '0 11px', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', color: 'var(--muted-text)', cursor: 'pointer', fontSize: 11.5, flex: 'none' }}>
                  <i data-lucide="star" style={{ width: 13, height: 13 }}></i>
                  {!mob && 'Destacar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
window.DestaquesPage = DestaquesPage;
