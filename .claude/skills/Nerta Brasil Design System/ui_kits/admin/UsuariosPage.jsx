// /admin/usuarios — gestão de usuários.
// Somente admins têm acesso; editores veem tela de acesso negado.
// Refinamentos: acesso negado para editor, criar usuário (email+senha+papel),
// erro de duplicidade de email inline, excluir a própria conta desabilitado
// com explicação visível, modal de confirmação com scrim, sem autocadastro.
const NUS = window.NertaBrasilDesignSystem_82f464;

function UsuariosPage({ userRole = 'admin' }) {
  const { Button } = NUS;
  const mob = window.useIsMobile(900);

  const [rows, setRows] = React.useState(window.ADMIN_USERS);
  const [form, setForm] = React.useState(null);
  const [f, setF] = React.useState({ name: '', email: '', password: '', role: 'editor' });
  const [formErrors, setFormErrors] = React.useState({});
  const [toDelete, setToDelete] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [networkErr, setNetworkErr] = React.useState(null);
  const [initialLoading, setInitialLoading] = React.useState(true);
  // Demo: toggle para simular papel do usuário logado
  const [demoRole, setDemoRole] = React.useState(userRole);

  React.useEffect(() => { setTimeout(() => setInitialLoading(false), 850); }, []);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  // ── Tela de acesso negado para editor ──
  if (demoRole !== 'admin') {
    return (
      <div>
        {/* Demo toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button onClick={() => setDemoRole('admin')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 14px', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', color: 'var(--muted-text)', cursor: 'pointer', fontSize: 12 }}>
            <i data-lucide="user-cog" style={{ width: 14, height: 14 }}></i>
            Demo: mudar para Admin
          </button>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          padding: '72px 20px', textAlign: 'center',
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
          background: 'var(--surface-card)',
        }}>
          <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'rgba(138,155,176,0.08)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-text)' }}>
            <i data-lucide="shield-off" style={{ width: 34, height: 34 }}></i>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--white)', marginBottom: 10 }}>Acesso restrito</div>
            <div style={{ fontSize: 14, color: 'var(--muted-text)', lineHeight: 1.7, maxWidth: 380 }}>
              A gestão de usuários é exclusiva para o papel <strong style={{ color: 'var(--provisao-gold)' }}>Admin</strong>.
              <br />Editores não têm permissão para criar, editar ou excluir contas.
            </div>
          </div>
          <div style={{ marginTop: 8, padding: '14px 20px', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: 12.5, color: 'var(--muted-text)', lineHeight: 1.6, maxWidth: 380, textAlign: 'left' }}>
            Para solicitar alterações em usuários, entre em contato com um administrador do painel.
          </div>
        </div>
      </div>
    );
  }

  const openNew = () => {
    setF({ name: '', email: '', password: '', role: 'editor' });
    setFormErrors({});
    setForm({});
  };

  const validateForm = () => {
    const e = {};
    if (!f.name.trim()) e.name = 'Nome obrigatório';
    if (!f.email.trim()) e.email = 'E-mail obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'E-mail inválido';
    else {
      // Duplicate email check
      const dup = rows.find(u => u.email.toLowerCase() === f.email.trim().toLowerCase() && (!form || u.id !== form.id));
      if (dup) e.email = 'Este e-mail já está cadastrado';
    }
    if (!form.id && !f.password) e.password = 'Senha provisória obrigatória';
    if (!form.id && f.password && f.password.length < 8) e.password = 'Mínimo de 8 caracteres';
    return e;
  };

  const save = () => {
    const e = validateForm();
    setFormErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true);
    setTimeout(() => {
      if (form.id) {
        setRows(r => r.map(u => u.id === form.id ? { ...u, name: f.name.trim(), role: f.role } : u));
      } else {
        setRows(r => [...r, { id: 'u' + Date.now(), name: f.name.trim(), email: f.email.trim(), role: f.role, created: 'hoje', self: false }]);
      }
      setSaving(false);
      setForm(null);
    }, 800);
  };

  const doDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      setRows(r => r.filter(u => u.id !== toDelete.id));
      setToDelete(null);
      setDeleting(false);
    }, 750);
  };

  const FieldError = ({ msg }) => msg
    ? <div style={{ marginTop: 6, fontSize: 11.5, color: '#E5634D', display: 'flex', alignItems: 'center', gap: 5 }}>
        <i data-lucide="alert-circle" style={{ width: 13, height: 13 }}></i>{msg}
      </div>
    : null;

  if (initialLoading) return <window.LoadingSkeleton rows={4} />;

  return (
    <div>
      <window.NetworkError message={networkErr} onDismiss={() => setNetworkErr(null)} />
      <window.DemoBar actions={[
        { label: 'Simular erro de rede', action: () => setNetworkErr('Erro 500 — servidor indisponível. Tente novamente.') },
        { label: 'Ver como Editor (acesso negado)', action: () => setDemoRole('editor') },
        { label: 'Simular email duplicado', action: () => { setF({ name: 'Novo Usuário', email: 'marina@nerta.com.br', password: '12345678', role: 'editor' }); setFormErrors({}); setForm({}); } },
        { label: 'Restaurar dados', action: () => { setRows(window.ADMIN_USERS); setNetworkErr(null); } },
      ]} />

      {/* Demo toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={() => setDemoRole('editor')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 30, padding: '0 12px', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', color: 'var(--muted-text)', cursor: 'pointer', fontSize: 11.5 }}>
          <i data-lucide="user" style={{ width: 13, height: 13 }}></i>
          Demo: ver como Editor
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--muted-text)' }}>
            <strong style={{ color: 'var(--light-gray)' }}>{rows.length}</strong> usuários
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', background: 'rgba(201,149,26,0.1)', border: '1px solid rgba(201,149,26,0.3)', borderRadius: 999 }}>
            <i data-lucide="shield-check" style={{ width: 12, height: 12, color: 'var(--provisao-gold)' }}></i>
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--provisao-gold)' }}>Acesso Admin</span>
          </div>
        </div>
        <Button variant="primary" onClick={openNew}
          leftIcon={<i data-lucide="user-plus" style={{ width: 16, height: 16 }}></i>}>
          Novo Usuário
        </Button>
      </div>

      {/* Tabela */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 0.7fr 0.55fr' : '1.5fr 1.6fr 0.7fr 0.9fr 0.6fr', gap: 12, padding: '12px 18px', background: 'var(--surface-raised)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light-gray)' }}>
          <span>Nome</span>{!mob && <span>E-mail</span>}<span>Papel</span>{!mob && <span>Criado em</span>}<span style={{ textAlign: 'right' }}>Ações</span>
        </div>

        {rows.map((u, i) => (
          <div key={u.id} style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 0.7fr 0.55fr' : '1.5fr 1.6fr 0.7fr 0.9fr 0.6fr', gap: 12, alignItems: 'center', padding: '12px 18px', background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 32, height: 32, flex: 'none', borderRadius: 999, background: u.role === 'admin' ? 'rgba(201,149,26,0.15)' : 'var(--blue-soft)', color: u.role === 'admin' ? 'var(--provisao-gold)' : 'var(--sky-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>
                {u.name.charAt(0)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: 'var(--white)', fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {u.name}
                  {u.self && <span style={{ color: 'var(--muted-text)', fontWeight: 400, fontSize: 11, marginLeft: 6 }}>(você)</span>}
                </div>
              </div>
            </div>
            {!mob && <span style={{ color: 'var(--light-gray)', fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>}
            <window.RoleBadge role={u.role} />
            {!mob && <span style={{ color: 'var(--muted-text)', fontSize: 12.5 }}>{u.created}</span>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 7, alignItems: 'center' }}>
              <window.IconBtn icon="pencil" title="Editar" tone="blue"
                onClick={() => { setF({ name: u.name, email: u.email, password: '', role: u.role }); setFormErrors({}); setForm(u); }} />
              <div style={{ position: 'relative' }}>
                <window.IconBtn icon="trash-2" title={u.self ? 'Você não pode excluir a própria conta' : 'Excluir usuário'} tone="danger"
                  disabled={u.self}
                  onClick={u.self ? undefined : () => setToDelete(u)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nota sobre auto-exclusão */}
      {rows.some(u => u.self) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '10px 14px', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--muted-text)' }}>
          <i data-lucide="info" style={{ width: 14, height: 14, flex: 'none' }}></i>
          O botão excluir da sua própria conta está desabilitado. Para remover sua conta, peça a outro administrador.
        </div>
      )}

      {/* ── Modal Criar / Editar ── */}
      <window.Modal open={!!form} hideFooter width={460} onClose={() => !saving && setForm(null)}>
        <h3 style={{ fontSize: 19, marginBottom: 18 }}>{form && form.id ? 'Editar usuário' : 'Novo usuário'}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nome */}
          <div>
            <window.FieldLabel>Nome completo <span style={{ color: '#E5634D' }}>*</span></window.FieldLabel>
            <input value={f.name} onChange={(e) => { setF({ ...f, name: e.target.value }); setFormErrors(err => ({ ...err, name: null })); }}
              placeholder="Nome completo"
              style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid ' + (formErrors.name ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            <FieldError msg={formErrors.name} />
          </div>

          {/* E-mail */}
          <div>
            <window.FieldLabel>E-mail <span style={{ color: '#E5634D' }}>*</span>{form && form.id && <span style={{ color: 'var(--muted-text)', fontWeight: 400 }}> · não editável</span>}</window.FieldLabel>
            <input value={f.email} onChange={(e) => { setF({ ...f, email: e.target.value }); setFormErrors(err => ({ ...err, email: null })); }}
              disabled={!!(form && form.id)}
              type="email" placeholder="nome@nerta.com.br"
              style={{ width: '100%', height: 42, padding: '0 14px', background: form && form.id ? 'var(--navy-light)' : 'var(--surface-sunken)', border: '1px solid ' + (formErrors.email ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', color: form && form.id ? 'var(--muted-text)' : 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', cursor: form && form.id ? 'not-allowed' : 'text', boxSizing: 'border-box' }} />
            <FieldError msg={formErrors.email} />
          </div>

          {/* Senha — apenas no cadastro */}
          {!(form && form.id) && (
            <div>
              <window.FieldLabel hint="o usuário troca no primeiro acesso">Senha provisória <span style={{ color: '#E5634D' }}>*</span></window.FieldLabel>
              <input value={f.password} onChange={(e) => { setF({ ...f, password: e.target.value }); setFormErrors(err => ({ ...err, password: null })); }}
                type="password" placeholder="Mínimo 8 caracteres"
                style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid ' + (formErrors.password ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              <FieldError msg={formErrors.password} />
            </div>
          )}
          {form && form.id && (
            <div style={{ padding: '10px 14px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', fontSize: 12.5, color: 'var(--muted-text)' }}>
              <i data-lucide="key" style={{ width: 13, height: 13, verticalAlign: 'middle', marginRight: 6 }}></i>
              Senha: redefinição via e-mail, não editável aqui.
            </div>
          )}

          {/* Papel */}
          <div>
            <window.FieldLabel>Papel</window.FieldLabel>
            <div style={{ position: 'relative' }}>
              <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}
                style={{ width: '100%', height: 42, padding: '0 34px 0 14px', appearance: 'none', WebkitAppearance: 'none', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', boxSizing: 'border-box' }}>
                <option value="editor" style={{ background: '#112644' }}>Editor — gerencia produtos e categorias</option>
                <option value="admin" style={{ background: '#112644' }}>Admin — acesso completo, inclui usuários</option>
              </select>
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-text)', fontSize: 10 }}>▾</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <Button variant="secondary" size="sm" onClick={() => !saving && setForm(null)}>Cancelar</Button>
          <Button variant="primary" size="sm" onClick={save}
            leftIcon={saving ? <window.Spinner size={14} color="#fff" /> : null}>
            {saving ? 'Salvando…' : (form && form.id ? 'Salvar' : 'Criar usuário')}
          </Button>
        </div>
      </window.Modal>

      {/* ── Modal Confirmação de exclusão ── */}
      <window.Modal open={!!toDelete} title="Excluir usuário?" destructive
        confirmLabel={deleting ? 'Removendo…' : 'Excluir'}
        onClose={() => !deleting && setToDelete(null)}
        onConfirm={!deleting ? doDelete : undefined}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 38, height: 38, flex: 'none', borderRadius: 999, background: toDelete && toDelete.role === 'admin' ? 'rgba(201,149,26,0.15)' : 'var(--blue-soft)', color: toDelete && toDelete.role === 'admin' ? 'var(--provisao-gold)' : 'var(--sky-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
            {toDelete && toDelete.name.charAt(0)}
          </div>
          <div>
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--light-gray)' }}>
              Remover o acesso de <strong style={{ color: 'var(--white)' }}>{toDelete && toDelete.name}</strong>?
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--muted-text)', lineHeight: 1.5 }}>
              A conta perde acesso ao painel imediatamente. Esta ação não pode ser desfeita.
            </p>
            {deleting && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <window.Spinner size={14} /><span style={{ fontSize: 12, color: 'var(--sky-blue)' }}>Removendo acesso…</span>
              </div>
            )}
          </div>
        </div>
      </window.Modal>
    </div>
  );
}
window.UsuariosPage = UsuariosPage;
