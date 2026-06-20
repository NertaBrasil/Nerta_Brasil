// /admin/categorias — listagem + criar/editar/excluir.
// Refinamentos: slug editável no modal, erro de duplicidade inline,
// exclusão bloqueada com mensagem explicativa (categoria com produtos),
// modal de confirmação com scrim nas exclusões permitidas, estados de loading.
const NCG = window.NertaBrasilDesignSystem_82f464;

function CategoriasPage() {
  const { Button } = NCG;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_CATEGORIES);
  const [form, setForm] = React.useState(null);
  const [fname, setFname] = React.useState('');
  const [fslug, setFslug] = React.useState('');
  const [fslugManual, setFslugManual] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({});
  const [toDelete, setToDelete] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [networkErr, setNetworkErr] = React.useState(null);
  const [initialLoading, setInitialLoading] = React.useState(true);

  React.useEffect(() => { setTimeout(() => setInitialLoading(false), 800); }, []);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  // Auto-gerar slug do nome
  React.useEffect(() => {
    if (!fslugManual) setFslug(window.slugify(fname));
  }, [fname, fslugManual]);

  const openNew = () => {
    setFname(''); setFslug(''); setFslugManual(false); setFormErrors({}); setForm({});
  };
  const openEdit = (c) => {
    setFname(c.name); setFslug(c.slug); setFslugManual(false); setFormErrors({}); setForm(c);
  };

  const validateForm = () => {
    const e = {};
    if (!fname.trim()) { e.name = 'Nome obrigatório'; return e; }
    // Duplicate name check
    const dupName = rows.find(c => c.name.toLowerCase() === fname.trim().toLowerCase() && (!form || c.id !== form.id));
    if (dupName) e.name = 'Já existe uma categoria com esse nome';
    // Duplicate slug check
    const dupSlug = rows.find(c => c.slug === fslug && (!form || c.id !== form.id));
    if (dupSlug && !e.name) e.slug = 'Slug já utilizado — edite manualmente';
    return e;
  };

  const save = () => {
    const e = validateForm();
    setFormErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true);
    setTimeout(() => {
      if (form.id) {
        setRows(r => r.map(c => c.id === form.id ? { ...c, name: fname.trim(), slug: fslug } : c));
      } else {
        setRows(r => [...r, { id: 'c' + Date.now(), name: fname.trim(), slug: fslug, count: 0 }]);
      }
      setSaving(false);
      setForm(null);
    }, 700);
  };

  const handleDelete = (c) => {
    // Sempre abrir modal — se count > 0, é modal de bloqueio; se count === 0, é confirm modal.
    setToDelete(c);
  };

  const doDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      setRows(r => r.filter(c => c.id !== toDelete.id));
      setToDelete(null);
      setDeleting(false);
    }, 750);
  };

  const FieldError = ({ msg }) => msg
    ? <div style={{ marginTop: 6, fontSize: 11.5, color: '#E5634D', display: 'flex', alignItems: 'center', gap: 5 }}>
        <i data-lucide="alert-circle" style={{ width: 13, height: 13 }}></i>{msg}
      </div>
    : null;

  const isBlocked = toDelete && toDelete.count > 0;

  if (initialLoading) return <window.LoadingSkeleton rows={5} />;

  return (
    <div>
      <window.NetworkError message={networkErr} onDismiss={() => setNetworkErr(null)} />
      <window.DemoBar actions={[
        { label: 'Simular erro de rede', action: () => setNetworkErr('Falha ao salvar — verifique a conexão.') },
        { label: 'Estado vazio', action: () => setRows([]) },
        { label: 'Simular duplicidade', action: () => { const c = window.ADMIN_CATEGORIES[0]; setFname(c.name); setFslug(c.slug); setFslugManual(false); setForm({}); } },
        { label: 'Restaurar dados', action: () => { setRows(window.ADMIN_CATEGORIES); setNetworkErr(null); } },
      ]} />

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ color: 'var(--muted-text)', fontSize: 13 }}>
          <strong style={{ color: 'var(--light-gray)' }}>{rows.length}</strong> categorias
        </div>
        <Button variant="primary" onClick={openNew}
          leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>}>
          Nova Categoria
        </Button>
      </div>

      {/* Estado vazio */}
      {rows.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '72px 20px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-text)' }}>
            <i data-lucide="tags" style={{ width: 28, height: 28 }}></i>
          </div>
          <div>
            <div style={{ fontSize: 17, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>Nenhuma categoria cadastrada</div>
            <div style={{ fontSize: 13, color: 'var(--muted-text)', maxWidth: 300, lineHeight: 1.6 }}>Crie categorias para organizar os produtos no catálogo.</div>
          </div>
          <Button variant="primary" onClick={openNew} leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>}>Criar primeira categoria</Button>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 0.7fr 0.6fr' : '1.6fr 1.4fr 0.8fr 0.7fr', gap: 12, padding: '12px 18px', background: 'var(--surface-raised)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light-gray)' }}>
            <span>Nome</span>{!mob && <span>Slug</span>}<span>Produtos</span><span style={{ textAlign: 'right' }}>Ações</span>
          </div>

          {rows.map((c, i) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 0.7fr 0.6fr' : '1.6fr 1.4fr 0.8fr 0.7fr', gap: 12, alignItems: 'center', padding: '13px 18px', background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 14 }}>{c.name}</span>
              {!mob && <span style={{ color: 'var(--sky-blue)', fontSize: 12.5, fontFamily: '"Courier New", monospace' }}>{c.slug}</span>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: c.count > 0 ? 'var(--light-gray)' : 'var(--muted-text)', fontSize: 13 }}>{c.count}</span>
                {c.count > 0 && <span style={{ fontSize: 11, color: 'var(--muted-text)' }}>{c.count === 1 ? 'produto' : 'produtos'}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 7 }}>
                <window.IconBtn icon="pencil" title="Editar" tone="blue" onClick={() => openEdit(c)} />
                <window.IconBtn icon="trash-2" title={c.count > 0 ? 'Ver restrição de exclusão' : 'Excluir'} tone="danger" onClick={() => handleDelete(c)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal Criar / Editar ── */}
      <window.Modal open={!!form} hideFooter width={440} onClose={() => !saving && setForm(null)}>
        <h3 style={{ fontSize: 19, marginBottom: 18 }}>{form && form.id ? 'Editar categoria' : 'Nova categoria'}</h3>

        <div style={{ marginBottom: 14 }}>
          <window.FieldLabel>Nome <span style={{ color: '#E5634D' }}>*</span></window.FieldLabel>
          <input value={fname} onChange={(e) => { setFname(e.target.value); setFormErrors(err => ({ ...err, name: null })); }}
            placeholder="Detergente Espuma Ativa"
            style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid ' + (formErrors.name ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          <FieldError msg={formErrors.name} />
        </div>

        <div style={{ marginBottom: 22 }}>
          <window.FieldLabel hint="auto-gerado do nome, editável">Slug</window.FieldLabel>
          <div style={{ display: 'flex', alignItems: 'center', height: 42, background: 'var(--surface-sunken)', border: '1px solid ' + (formErrors.slug ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <span style={{ padding: '0 8px 0 12px', fontSize: 12, color: 'var(--muted-text)', whiteSpace: 'nowrap' }}>/categorias/</span>
            <input value={fslug}
              onChange={(e) => { setFslug(window.slugify(e.target.value)); setFslugManual(true); setFormErrors(err => ({ ...err, slug: null })); }}
              style={{ flex: 1, height: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--sky-blue)', fontFamily: '"Courier New", monospace', fontSize: 13 }} />
            {fslugManual && (
              <button onClick={() => { setFslugManual(false); setFslug(window.slugify(fname)); }} title="Resetar para auto"
                style={{ padding: '0 10px', background: 'none', border: 'none', color: 'var(--muted-text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                <i data-lucide="rotate-ccw" style={{ width: 13, height: 13 }}></i>
              </button>
            )}
          </div>
          <FieldError msg={formErrors.slug} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={() => !saving && setForm(null)}>Cancelar</Button>
          <Button variant="primary" size="sm" onClick={save}
            leftIcon={saving ? <window.Spinner size={14} color="#fff" /> : null}>
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </window.Modal>

      {/* ── Modal Exclusão bloqueada ── */}
      <window.Modal
        open={!!toDelete && isBlocked}
        title="Não é possível excluir esta categoria"
        confirmLabel="Entendi"
        cancelLabel={null}
        hideFooter={false}
        onClose={() => setToDelete(null)}
        onConfirm={() => setToDelete(null)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-md)', background: 'rgba(229,163,61,0.12)', border: '1px solid rgba(229,163,61,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E5A03D' }}>
            <i data-lucide="lock" style={{ width: 18, height: 18 }}></i>
          </div>
          <div>
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--light-gray)' }}>
              A categoria <strong style={{ color: 'var(--white)' }}>{toDelete && toDelete.name}</strong> possui{' '}
              <strong style={{ color: '#E5A03D' }}>{toDelete && toDelete.count} produto(s) vinculado(s)</strong>.
            </p>
            <p style={{ margin: '10px 0 0', fontSize: 12.5, color: 'var(--muted-text)', lineHeight: 1.6 }}>
              Reclassifique ou exclua os produtos vinculados antes de remover a categoria. Isso garante que nenhum produto fique sem classificação no catálogo.
            </p>
            <a href="produtos.html" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 12.5, color: 'var(--sky-blue)', textDecoration: 'none' }}>
              <i data-lucide="arrow-right" style={{ width: 13, height: 13 }}></i>
              Ir para listagem de produtos
            </a>
          </div>
        </div>
      </window.Modal>

      {/* ── Modal Confirmação de exclusão ── */}
      <window.Modal
        open={!!toDelete && !isBlocked}
        title="Excluir categoria?"
        destructive
        confirmLabel={deleting ? 'Excluindo…' : 'Excluir'}
        onClose={() => !deleting && setToDelete(null)}
        onConfirm={!deleting ? doDelete : undefined}>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Excluir <strong style={{ color: 'var(--white)' }}>{toDelete && toDelete.name}</strong>? Esta ação não pode ser desfeita.
        </p>
        {deleting && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <window.Spinner size={14} /><span style={{ fontSize: 12, color: 'var(--sky-blue)' }}>Excluindo…</span>
          </div>
        )}
      </window.Modal>
    </div>
  );
}
window.CategoriasPage = CategoriasPage;
