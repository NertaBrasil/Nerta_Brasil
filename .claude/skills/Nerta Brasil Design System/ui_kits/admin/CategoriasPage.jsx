// /admin/categorias — category listing + create/edit/delete.
const NCG = window.NertaBrasilDesignSystem_82f464;

function CategoriasPage() {
  const { Button, Input } = NCG;
  const Modal = window.Modal;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_CATEGORIES);
  const [form, setForm] = React.useState(null); // {id?, name}
  const [name, setName] = React.useState('');
  const [toDelete, setToDelete] = React.useState(null);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const openNew = () => { setName(''); setForm({}); };
  const openEdit = (c) => { setName(c.name); setForm(c); };
  const save = () => {
    if (!name.trim()) return;
    if (form.id) setRows((r) => r.map((c) => c.id === form.id ? { ...c, name, slug: window.slugify(name) } : c));
    else setRows((r) => [...r, { id: 'c' + Date.now(), name, slug: window.slugify(name), count: 0 }]);
    setForm(null);
  };
  const doDelete = () => { setRows((r) => r.filter((c) => c.id !== toDelete.id)); setToDelete(null); };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ color: 'var(--muted-text)', fontSize: 13 }}>{rows.length} categorias</div>
        <Button variant="primary" onClick={openNew} leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>}>Nova Categoria</Button>
      </div>

      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 0.8fr 0.7fr' : '1.4fr 1.2fr 0.8fr 0.8fr', gap: 12, padding: '13px 18px', background: 'var(--surface-raised)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light-gray)' }}>
          <span>Nome</span>{!mob && <span>Slug</span>}<span>Produtos</span><span style={{ textAlign: 'right' }}>Ações</span>
        </div>
        {rows.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 0.8fr 0.7fr' : '1.4fr 1.2fr 0.8fr 0.8fr', gap: 12, alignItems: 'center', padding: '13px 18px', background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 14 }}>{c.name}</span>
            {!mob && <span style={{ color: 'var(--sky-blue)', fontSize: 12.5, fontFamily: 'var(--font-body)' }}>{c.slug}</span>}
            <span style={{ color: 'var(--light-gray)', fontSize: 13 }}>{c.count} {c.count === 1 ? 'produto' : 'produtos'}</span>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 7 }}>
              <window.IconBtn icon="pencil" title="Editar" tone="blue" onClick={() => openEdit(c)} />
              <window.IconBtn icon="trash-2" title={c.count > 0 ? 'Categoria com produtos' : 'Excluir'} tone="danger" onClick={() => setToDelete(c)} />
            </div>
          </div>
        ))}
      </div>

      {/* create / edit modal */}
      <Modal open={!!form} hideFooter width={420} onClose={() => setForm(null)}>
        <h3 style={{ fontSize: 19, marginBottom: 16 }}>{form && form.id ? 'Editar categoria' : 'Nova categoria'}</h3>
        <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Detergente Espuma Ativa" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--muted-text)' }}>slug:</span>
          <span style={{ fontSize: 12, color: 'var(--sky-blue)' }}>{window.slugify(name) || '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <Button variant="secondary" size="sm" onClick={() => setForm(null)}>Cancelar</Button>
          <Button variant="primary" size="sm" onClick={save}>Salvar</Button>
        </div>
      </Modal>

      {/* delete modal — warns when linked products */}
      <Modal open={!!toDelete} title={toDelete && toDelete.count > 0 ? 'Categoria com produtos' : 'Excluir categoria?'}
        destructive={toDelete && toDelete.count === 0}
        confirmLabel={toDelete && toDelete.count > 0 ? 'Entendi' : 'Excluir'}
        hideFooter={false}
        onClose={() => setToDelete(null)}
        onConfirm={toDelete && toDelete.count > 0 ? () => setToDelete(null) : doDelete}>
        {toDelete && toDelete.count > 0 ? (
          <span><strong style={{ color: 'var(--white)' }}>{toDelete.name}</strong> possui {toDelete.count} produto(s) vinculado(s). Remova ou reclassifique os produtos antes de excluir a categoria.</span>
        ) : (
          <span>Excluir <strong style={{ color: 'var(--white)' }}>{toDelete && toDelete.name}</strong>? Esta ação não pode ser desfeita.</span>
        )}
      </Modal>
    </div>
  );
}
window.CategoriasPage = CategoriasPage;
