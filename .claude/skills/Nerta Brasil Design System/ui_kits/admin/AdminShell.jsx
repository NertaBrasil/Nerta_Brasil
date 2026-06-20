// Nerta Admin — shared shell (sidebar + topbar) and small UI helpers.
const NAS = window.NertaBrasilDesignSystem_82f464;

// Role badge — admin = gold, editor = sky blue.
function RoleBadge({ role }) {
  const { Badge } = NAS;
  return <Badge tone={role === 'admin' ? 'gold' : 'blue'} solid={false}>{role === 'admin' ? 'Admin' : 'Editor'}</Badge>;
}
window.RoleBadge = RoleBadge;

// Status pill — ativo (teal) / inativo (muted).
function StatusPill({ active }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 10px',
      borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: active ? 'var(--teal)' : 'var(--muted-text)',
      background: active ? 'rgba(29,184,126,0.1)' : 'var(--surface-raised)',
      border: '1px solid ' + (active ? 'rgba(29,184,126,0.4)' : 'var(--border-subtle)'),
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: active ? 'var(--teal)' : 'var(--muted-text)' }}></span>
      {active ? 'Ativo' : 'Inativo'}
    </span>
  );
}
window.StatusPill = StatusPill;

// Icon-only action button for table rows.
function IconBtn({ icon, title, tone = 'default', onClick, disabled = false }) {
  const color = disabled ? 'var(--action-disabled-text)' : tone === 'danger' ? '#E5634D' : tone === 'blue' ? 'var(--sky-blue)' : 'var(--muted-text)';
  const [h, setH] = React.useState(false);
  return (
    <button title={title} onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => !disabled && setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 34, height: 34, borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer',
        background: h ? 'var(--surface-raised)' : 'transparent',
        border: '1px solid ' + (h ? 'var(--border-strong)' : 'var(--border-subtle)'),
        opacity: disabled ? 0.4 : 1,
        color, transition: 'all var(--duration-fast)',
      }}>
      <i data-lucide={icon} style={{ width: 16, height: 16 }}></i>
    </button>
  );
}
window.IconBtn = IconBtn;

// Search input with leading icon.
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9, height: 42, padding: '0 14px', minWidth: 220, flex: 1, maxWidth: 360,
      background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
    }}>
      <i data-lucide="search" style={{ width: 16, height: 16, color: 'var(--muted-text)' }}></i>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || 'Buscar...'}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14 }} />
    </div>
  );
}
window.SearchBar = SearchBar;

function AdminShell({ active, title, userName = 'Marina Albuquerque', userRole = 'admin', children }) {
  const mob = window.useIsMobile(900);
  const [drawer, setDrawer] = React.useState(false);

  const items = [
    { id: 'produtos',   label: 'Produtos',   icon: 'package', href: 'produtos.html' },
    { id: 'categorias', label: 'Categorias', icon: 'tags',    href: 'categorias.html' },
    { id: 'destaques',  label: 'Destaques',  icon: 'star',    href: 'destaques.html' },
    { id: 'usuarios',   label: 'Usuários',   icon: 'users',   href: 'usuarios.html', adminOnly: true },
  ].filter((i) => !(i.adminOnly && userRole !== 'admin'));

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const Sidebar = (
    <aside style={{
      width: 248, flex: 'none', background: 'var(--surface-sunken)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column', padding: '22px 16px',
      height: mob ? '100%' : 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 22px' }}>
        <img src={window.NERTA_LOGO_DARK} alt="nerta" height="30" />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--provisao-gold)' }}>Admin</span>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((it) => {
          const on = it.id === active;
          return (
            <a key={it.id} href={it.href} style={{
              display: 'flex', alignItems: 'center', gap: 12, height: 44, padding: '0 14px',
              borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
              color: on ? 'var(--white)' : 'var(--muted-text)',
              background: on ? 'var(--blue-soft)' : 'transparent',
              borderLeft: on ? '3px solid var(--nerta-blue)' : '3px solid transparent',
              transition: 'all var(--duration-fast)', textDecoration: 'none',
            }}>
              <i data-lucide={it.icon} style={{ width: 18, height: 18, color: on ? 'var(--sky-blue)' : 'var(--muted-text)' }}></i>
              {it.label}
            </a>
          );
        })}
        {/* Usuários shown as locked entry for editors */}
        {userRole !== 'admin' && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 12, height: 44, padding: '0 14px',
            borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
            color: 'var(--border-strong)', borderLeft: '3px solid transparent', cursor: 'not-allowed',
          }}>
            <i data-lucide="lock" style={{ width: 18, height: 18 }}></i>
            Usuários
          </span>
        )}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: '1px solid var(--border-subtle)', fontSize: 10.5, color: 'var(--muted-text)', lineHeight: 1.5, padding: '18px 8px 0' }}>
        Painel administrativo Nerta Brasil
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy-deep)' }}>
      {!mob && Sidebar}

      {mob && drawer && (
        <div onClick={() => setDrawer(false)} style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'var(--scrim)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 248, zIndex: 121 }}>{Sidebar}</div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* TOP BAR */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          padding: mob ? '12px 18px' : '16px 32px',
          background: 'rgba(13,27,46,0.88)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            {mob && (
              <button onClick={() => setDrawer(true)} style={{ display: 'inline-flex', background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer', padding: 0 }}>
                <i data-lucide="menu" style={{ width: 24, height: 24 }}></i>
              </button>
            )}
            <h1 style={{ fontSize: mob ? 18 : 22, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {!mob && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: 'var(--white)', fontWeight: 500 }}>{userName}</div>
                <div style={{ marginTop: 2 }}><RoleBadge role={userRole} /></div>
              </div>
            )}
            <button title="Sair" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, height: 38, padding: '0 14px',
              background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)',
              color: 'var(--muted-text)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13,
            }}>
              <i data-lucide="log-out" style={{ width: 15, height: 15 }}></i>{!mob && 'Sair'}
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: mob ? '22px 18px 48px' : '32px 32px 56px' }}>{children}</main>
      </div>
    </div>
  );
}
window.AdminShell = AdminShell;
