// /admin/produtos — product listing with search, filters, inline actions.
const NPL = window.NertaBrasilDesignSystem_82f464;

function ProdutosPage() {
  const { Button, Badge } = NPL;
  const Switch = window.Switch, Modal = window.Modal;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_PRODUCTS);
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('__all');
  const [status, setStatus] = React.useState('__all');
  const [feat, setFeat] = React.useState('__all');
  const [toDelete, setToDelete] = React.useState(null);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const cats = [...new Set(window.ADMIN_PRODUCTS.map((p) => p.category))];
  const shown = rows.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (cat !== '__all' && p.category !== cat) return false;
    if (status !== '__all' && (status === 'Ativo') !== p.active) return false;
    if (feat !== '__all' && (feat === 'Em destaque') !== p.featured) return false;
    return true;
  });

  const toggleActive = (id) => setRows((r) => r.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const doDelete = () => { setRows((r) => r.filter((p) => p.id !== toDelete.id)); setToDelete(null); };

  const Thumb = ({ icon }) => (
    <div style={{ width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-sm)', background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-border)' }}>
      <i data-lucide={icon} style={{ width: 20, height: 20 }}></i>
    </div>
  );

  return (
    <div>
      {/* toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ color: 'var(--muted-text)', fontSize: 13 }}>{shown.length} de {rows.length} produtos</div>
        <Button variant="primary" href="Nerta-Admin-Produtos-Form.html"
          leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>}>Novo Produto</Button>
      </div>

      {/* filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <window.SearchBar value={q} onChange={setQ} placeholder="Buscar por nome..." />
        <window.FilterSelect label="Categoria" value={cat} options={cats} onChange={setCat} />
        <window.FilterSelect label="Status" value={status} options={['Ativo', 'Inativo']} onChange={setStatus} />
        <window.FilterSelect label="Destaque" value={feat} options={['Em destaque', 'Sem destaque']} onChange={setFeat} />
      </div>

      {/* table / cards */}
      {shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', color: 'var(--muted-text)' }}>
          <i data-lucide="package-x" style={{ width: 40, height: 40, color: 'var(--navy-border)' }}></i>
          <div style={{ marginTop: 14, fontSize: 15, color: 'var(--light-gray)' }}>Nenhum produto encontrado</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Ajuste a busca ou os filtros.</div>
        </div>
      ) : mob ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shown.map((p) => (
            <div key={p.id} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Thumb icon={p.icon} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 15 }}>{p.name}</span>
                    {p.featured && <Badge tone="gold" solid>Destaque</Badge>}
                  </div>
                  <div style={{ color: 'var(--muted-text)', fontSize: 12, marginTop: 3 }}>{p.category} · {p.line}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                    <span style={{ color: 'var(--sky-blue)', fontWeight: 700, fontSize: 14 }}>{window.brl(p.price)}</span>
                    <span style={{ color: p.stock === 0 ? '#E5634D' : 'var(--muted-text)', fontSize: 12 }}>Estoque: {p.stock}</span>
                    <window.StatusPill active={p.active} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <window.IconBtn icon="pencil" title="Editar" tone="blue" onClick={() => { window.location.href = 'Nerta-Admin-Produtos-Form.html'; }} />
                <Switch checked={p.active} onChange={() => toggleActive(p.id)} size="sm" />
                <window.IconBtn icon="trash-2" title="Excluir" tone="danger" onClick={() => setToDelete(p)} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 0.8fr 0.6fr 0.8fr 1fr', gap: 12, padding: '13px 18px', background: 'var(--surface-raised)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light-gray)' }}>
            <span>Produto</span><span>Categoria</span><span>Preço</span><span>Estoque</span><span>Status</span><span style={{ textAlign: 'right' }}>Ações</span>
          </div>
          {shown.map((p, i) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 0.8fr 0.6fr 0.8fr 1fr', gap: 12, alignItems: 'center', padding: '12px 18px', background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <Thumb icon={p.icon} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    {p.featured && <i data-lucide="star" style={{ width: 14, height: 14, color: 'var(--provisao-gold)', fill: 'var(--provisao-gold)' }}></i>}
                  </div>
                  <div style={{ color: 'var(--muted-text)', fontSize: 11.5, marginTop: 2 }}>{p.line}</div>
                </div>
              </div>
              <span style={{ color: 'var(--light-gray)', fontSize: 13 }}>{p.category}</span>
              <span style={{ color: 'var(--sky-blue)', fontWeight: 700, fontSize: 13.5 }}>{window.brl(p.price)}</span>
              <span style={{ color: p.stock === 0 ? '#E5634D' : 'var(--light-gray)', fontSize: 13, fontWeight: p.stock === 0 ? 600 : 400 }}>{p.stock}</span>
              <window.StatusPill active={p.active} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 7 }}>
                <window.IconBtn icon="pencil" title="Editar" tone="blue" onClick={() => { window.location.href = 'Nerta-Admin-Produtos-Form.html'; }} />
                <window.IconBtn icon={p.active ? 'eye' : 'eye-off'} title={p.active ? 'Desativar' : 'Ativar'} onClick={() => toggleActive(p.id)} />
                <window.IconBtn icon="trash-2" title="Excluir" tone="danger" onClick={() => setToDelete(p)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!toDelete} title="Excluir produto?" destructive confirmLabel="Excluir"
        onClose={() => setToDelete(null)} onConfirm={doDelete}>
        Tem certeza que deseja excluir <strong style={{ color: 'var(--white)' }}>{toDelete && toDelete.name}</strong>? Esta ação não pode ser desfeita e o produto sai do catálogo imediatamente.
      </Modal>
    </div>
  );
}
window.ProdutosPage = ProdutosPage;
