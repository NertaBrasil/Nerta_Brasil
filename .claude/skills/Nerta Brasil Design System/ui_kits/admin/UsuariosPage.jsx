// /admin/usuarios — user management (admin only; hidden from editor).
const NUS = window.NertaBrasilDesignSystem_82f464;

function UsuariosPage() {
  const { Button, Input, Select } = NUS;
  const Modal = window.Modal;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_USERS);
  const [form, setForm] = React.useState(null); // {id?, name, email, role}
  const [toDelete, setToDelete] = React.useState(null);
  const [f, setF] = React.useState({ name: '', email: '', role: 'editor' });

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const openNew = () => { setF({ name: '', email: '', role: 'editor' }); setForm({}); };
  const openEdit = (u) => { setF({ name: u.name, email: u.email, role: u.role }); setForm(u); };
  const save = () => {
    if (form.id) setRows((r) => r.map((u) => u.id === form.id ? { ...u, name: f.name, role: f.role } : u));
    else setRows((r) => [...r, { id: 'u' + Date.now(), name: f.name, email: f.email, role: f.role, created: 'hoje', self: false }]);
    setForm(null);
  };
  const doDelete = () => { setRows((r) => r.filter((u) => u.id !== toDelete.id)); setToDelete(null); };

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ color: 'var(--muted-text)', fontSize: 13 }}>{rows.length} usuários · somente admins podem gerenciar</div>
        <Button variant="primary" onClick={openNew} leftIcon={<i data-lucide="user-plus" style={{ width: 16, height: 16 }}></i>}>Novo Usuário</Button>
      </div>

      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 0.7fr 0.6fr' : '1.4fr 1.5fr 0.7fr 0.8fr 0.7fr', gap: 12, padding: '13px 18px', background: 'var(--surface-raised)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light-gray)' }}>
          <span>Nome</span>{!mob && <span>E-mail</span>}<span>Papel</span>{!mob && <span>Criado</span>}<span style={{ textAlign: 'right' }}>Ações</span>
        </div>
        {rows.map((u, i) => (
          <div key={u.id} style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 0.7fr 0.6fr' : '1.4fr 1.5fr 0.7fr 0.8fr 0.7fr', gap: 12, alignItems: 'center', padding: '13px 18px', background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 32, height: 32, flex: 'none', borderRadius: 999, background: u.role === 'admin' ? 'var(--gold-soft)' : 'var(--blue-soft)', color: u.role === 'admin' ? 'var(--provisao-gold)' : 'var(--sky-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{u.name.charAt(0)}</div>
              <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}{u.self && <span style={{ color: 'var(--muted-text)', fontWeight: 400, fontSize: 11 }}> (você)</span>}</span>
            </div>
            {!mob && <span style={{ color: 'var(--light-gray)', fontSize: 13 }}>{u.email}</span>}
            <span><window.RoleBadge role={u.role} /></span>
            {!mob && <span style={{ color: 'var(--muted-text)', fontSize: 12.5 }}>{u.created}</span>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 7 }}>
              <window.IconBtn icon="pencil" title="Editar" tone="blue" onClick={() => openEdit(u)} />
              <window.IconBtn icon="trash-2" title={u.self ? 'Não é possível excluir a própria conta' : 'Excluir'} tone="danger" disabled={u.self} onClick={() => setToDelete(u)} />
            </div>
          </div>
        ))}
      </div>

      {/* create / edit modal */}
      <Modal open={!!form} hideFooter width={440} onClose={() => setForm(null)}>
        <h3 style={{ fontSize: 19, marginBottom: 16 }}>{form && form.id ? 'Editar usuário' : 'Novo usuário'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nome" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Nome completo" />
          <Input label="E-mail" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="nome@provisao.com.br" disabled={!!(form && form.id)} hint={form && form.id ? 'E-mail não pode ser alterado' : undefined} />
          {!(form && form.id) && <Input label="Senha provisória" type="password" placeholder="••••••••" hint="O usuário troca no primeiro acesso" />}
          {form && form.id && <div style={{ fontSize: 11.5, color: 'var(--muted-text)' }}>Senha: redefinição via e-mail (não editável aqui).</div>}
          <Select label="Papel" options={[{ value: 'admin', label: 'Admin — acesso total' }, { value: 'editor', label: 'Editor — sem gestão de usuários' }]} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <Button variant="secondary" size="sm" onClick={() => setForm(null)}>Cancelar</Button>
          <Button variant="primary" size="sm" onClick={save}>Salvar</Button>
        </div>
      </Modal>

      <Modal open={!!toDelete} title="Excluir usuário?" destructive confirmLabel="Excluir"
        onClose={() => setToDelete(null)} onConfirm={doDelete}>
        Remover o acesso de <strong style={{ color: 'var(--white)' }}>{toDelete && toDelete.name}</strong>? A conta perde acesso ao painel imediatamente.
      </Modal>
    </div>
  );
}
window.UsuariosPage = UsuariosPage;
