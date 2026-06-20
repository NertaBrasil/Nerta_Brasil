// /admin/produtos — product listing. Shows ALL products (active + inactive).
// Refinements: status indicator, empty state (no products vs. filtered), delete modal w/ scrim,
// loading states (toggle, delete), network/server error banner.
const NPL = window.NertaBrasilDesignSystem_82f464;

function ProdutosPage() {
  const { Button, Badge } = NPL;
  const mob = window.useIsMobile(900);

  const [rows, setRows] = React.useState(window.ADMIN_PRODUCTS);
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('__all');
  const [statusFilter, setStatusFilter] = React.useState('__all');
  const [featFilter, setFeatFilter] = React.useState('__all');
  const [toDelete, setToDelete] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState(null);
  const [networkErr, setNetworkErr] = React.useState(null);
  const [initialLoading, setInitialLoading] = React.useState(true);

  React.useEffect(() => { setTimeout(() => setInitialLoading(false), 900); }, []);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const cats = [...new Set(window.ADMIN_PRODUCTS.map((p) => p.category))];

  const shown = rows.filter((p) => {
    // IMPORTANT: admin sempre vê ativos E inativos; nunca ocultar inativos.
    if (q) {
      const lq = q.toLowerCase();
      if (!p.name.toLowerCase().includes(lq) && !p.category.toLowerCase().includes(lq) && !p.line.toLowerCase().includes(lq)) return false;
    }
    if (cat !== '__all' && p.category !== cat) return false;
    if (statusFilter === 'ativo' && !p.active) return false;
    if (statusFilter === 'inativo' && p.active) return false;
    if (featFilter === 'destaque' && !p.featured) return false;
    if (featFilter === 'comum' && p.featured) return false;
    return true;
  });

  const toggleActive = (id) => {
    if (togglingId) return;
    setTogglingId(id);
    setTimeout(() => {
      setRows((r) => r.map((p) => p.id === id ? { ...p, active: !p.active } : p));
      setTogglingId(null);
    }, 600);
  };

  const doDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      setRows((r) => r.filter((p) => p.id !== toDelete.id));
      setToDelete(null);
      setDeleting(false);
    }, 850);
  };

  const Thumb = ({ icon, active }) => (
    <div style={{
      width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-sm)',
      background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)',
      border: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: active ? 'var(--sky-blue)' : 'var(--navy-border)',
      opacity: active ? 1 : 0.55,
    }}>
      <i data-lucide={icon} style={{ width: 20, height: 20 }}></i>
    </div>
  );

  if (initialLoading) return <window.LoadingSkeleton rows={6} />;

  // Estado vazio real — nenhum produto cadastrado
  if (rows.length === 0) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <Button variant="primary" href="produtos-form.html"
            leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>}>
            Novo Produto
          </Button>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 18, padding: '80px 20px', border: '1px dashed var(--border-strong)',
          borderRadius: 'var(--radius-lg)', textAlign: 'center',
        }}>
          <div style={{ width: 68, height: 68, borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-text)' }}>
            <i data-lucide="package" style={{ width: 32, height: 32 }}></i>
          </div>
          <div>
            <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>Nenhum produto cadastrado</div>
            <div style={{ fontSize: 13.5, color: 'var(--muted-text)', maxWidth: 340, lineHeight: 1.6 }}>
              Adicione o primeiro produto para que ele apareça no catálogo.
            </div>
          </div>
          <Button variant="primary" href="produtos-form.html"
            leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>}>
            Cadastrar primeiro produto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <window.NetworkError message={networkErr} onDismiss={() => setNetworkErr(null)} />
      <window.DemoBar actions={[
        { label: 'Simular erro de rede', action: () => setNetworkErr('Erro 500 — servidor indisponível. Tente novamente.') },
        { label: 'Estado vazio', action: () => setRows([]) },
        { label: 'Restaurar dados', action: () => { setRows(window.ADMIN_PRODUCTS); setNetworkErr(null); } },
      ]} />

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ color: 'var(--muted-text)', fontSize: 13 }}>
          Exibindo <strong style={{ color: 'var(--light-gray)' }}>{shown.length}</strong> de <strong style={{ color: 'var(--light-gray)' }}>{rows.length}</strong> produtos
          {rows.filter(p => !p.active).length > 0 && (
            <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--muted-text)' }}>
              · <span style={{ color: '#E5634D' }}>{rows.filter(p => !p.active).length} inativo(s)</span> incluso(s)
            </span>
          )}
        </div>
        <Button variant="primary" href="produtos-form.html"
          leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>}>
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <window.SearchBar value={q} onChange={setQ} placeholder="Buscar por nome, linha, categoria..." />
        <window.FilterSelect label="Categoria" value={cat} options={cats} onChange={setCat} />
        <window.FilterSelect label="Status" value={statusFilter}
          options={[{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }]}
          onChange={setStatusFilter} />
        <window.FilterSelect label="Destaque" value={featFilter}
          options={[{ value: 'destaque', label: 'Em destaque' }, { value: 'comum', label: 'Sem destaque' }]}
          onChange={setFeatFilter} />
      </div>

      {/* Lista vazia (filtros sem resultado) */}
      {shown.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '56px 20px',
          border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)',
        }}>
          <i data-lucide="search-x" style={{ width: 36, height: 36, color: 'var(--navy-border)' }}></i>
          <div style={{ marginTop: 14, fontSize: 15, color: 'var(--light-gray)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Nenhum produto corresponde</div>
          <div style={{ fontSize: 13, color: 'var(--muted-text)', marginTop: 6 }}>
            Ajuste a busca ou os filtros. Lembre: inativos também aparecem aqui.
          </div>
          <button onClick={() => { setQ(''); setCat('__all'); setStatusFilter('__all'); setFeatFilter('__all'); }}
            style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', color: 'var(--muted-text)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12 }}>
            <i data-lucide="x" style={{ width: 13, height: 13 }}></i>Limpar filtros
          </button>
        </div>
      ) : mob ? (
        /* Mobile: cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shown.map((p) => {
            const toggling = togglingId === p.id;
            return (
              <div key={p.id} style={{ background: 'var(--surface-card)', border: '1px solid ' + (p.active ? 'var(--border-subtle)' : 'rgba(138,155,176,0.15)'), borderRadius: 'var(--radius-md)', padding: 14, opacity: p.active ? 1 : 0.72 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Thumb icon={p.icon} active={p.active} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 15 }}>{p.name}</span>
                      {p.featured && <Badge tone="gold">Destaque</Badge>}
                      <window.StatusPill active={p.active} />
                    </div>
                    <div style={{ color: 'var(--muted-text)', fontSize: 12, marginTop: 3 }}>{p.category} · {p.line}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
                      <span style={{ color: 'var(--sky-blue)', fontWeight: 700, fontSize: 14 }}>{window.brl(p.price)}</span>
                      <span style={{ color: p.stock === 0 ? '#E5634D' : 'var(--muted-text)', fontSize: 12 }}>
                        {p.stock === 0 ? 'Sem estoque' : 'Estoque: ' + p.stock}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  {toggling
                    ? <window.Spinner size={18} />
                    : <window.IconBtn icon={p.active ? 'eye-off' : 'eye'} title={p.active ? 'Desativar' : 'Ativar'} onClick={() => toggleActive(p.id)} />
                  }
                  <window.IconBtn icon="pencil" title="Editar" tone="blue" onClick={() => { window.location.href = 'produtos-form.html?id=' + p.id; }} />
                  <window.IconBtn icon="trash-2" title="Excluir" tone="danger" onClick={() => setToDelete(p)} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Desktop: tabela */
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.6fr 1fr 0.7fr 0.6fr 0.9fr 1.1fr', gap: 12, padding: '12px 18px', background: 'var(--surface-raised)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light-gray)' }}>
            <span>Produto</span><span>Categoria</span><span>Preço</span><span>Estoque</span><span>Status</span><span style={{ textAlign: 'right' }}>Ações</span>
          </div>

          {shown.map((p, i) => {
            const toggling = togglingId === p.id;
            return (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '2.6fr 1fr 0.7fr 0.6fr 0.9fr 1.1fr',
                gap: 12, alignItems: 'center', padding: '11px 18px',
                background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)',
                borderTop: '1px solid var(--border-subtle)',
                opacity: p.active ? 1 : 0.68,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <Thumb icon={p.icon} active={p.active} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{p.name}</span>
                      {p.featured && <i data-lucide="star" style={{ width: 13, height: 13, color: 'var(--provisao-gold)', fill: 'var(--provisao-gold)', flex: 'none' }}></i>}
                    </div>
                    <div style={{ color: 'var(--muted-text)', fontSize: 11, marginTop: 2 }}>{p.line}</div>
                  </div>
                </div>
                <span style={{ color: 'var(--light-gray)', fontSize: 12.5 }}>{p.category}</span>
                <span style={{ color: 'var(--sky-blue)', fontWeight: 700, fontSize: 13 }}>{window.brl(p.price)}</span>
                <span style={{ color: p.stock === 0 ? '#E5634D' : 'var(--light-gray)', fontSize: 13, fontWeight: p.stock === 0 ? 600 : 400 }}>{p.stock}</span>
                <window.StatusPill active={p.active} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, alignItems: 'center' }}>
                  {toggling
                    ? <window.Spinner size={16} />
                    : <window.IconBtn icon={p.active ? 'eye-off' : 'eye'} title={p.active ? 'Desativar' : 'Ativar'} onClick={() => toggleActive(p.id)} />
                  }
                  <window.IconBtn icon="pencil" title="Editar" tone="blue" onClick={() => { window.location.href = 'produtos-form.html?id=' + p.id; }} />
                  <window.IconBtn icon="trash-2" title="Excluir" tone="danger" onClick={() => setToDelete(p)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmação de exclusão com scrim escuro */}
      <window.Modal open={!!toDelete} title="Excluir produto?" destructive
        confirmLabel={deleting ? 'Excluindo…' : 'Excluir'}
        onClose={() => !deleting && setToDelete(null)} onConfirm={!deleting ? doDelete : undefined}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-sm)', background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sky-blue)' }}>
            <i data-lucide={toDelete && toDelete.icon} style={{ width: 20, height: 20 }}></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--light-gray)', lineHeight: 1.6 }}>
              Tem certeza que deseja excluir <strong style={{ color: 'var(--white)' }}>{toDelete && toDelete.name}</strong>?
            </p>
            <p style={{ margin: '8px 0 0', color: 'var(--muted-text)', fontSize: 12.5, lineHeight: 1.5 }}>
              Esta ação não pode ser desfeita. O produto sai do catálogo imediatamente e todos os dados associados são perdidos.
            </p>
            {deleting && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <window.Spinner size={14} />
                <span style={{ fontSize: 12, color: 'var(--sky-blue)' }}>Excluindo…</span>
              </div>
            )}
          </div>
        </div>
      </window.Modal>
    </div>
  );
}
window.ProdutosPage = ProdutosPage;
