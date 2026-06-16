// Site header — sticky navy bar with logo + nav. (window-scoped babel module)
const { Button: NHButton } = window.NertaBrasilDesignSystem_82f464;

function Header({ current, onNav }) {
  const mob = window.useIsMobile();
  const links = [
    { id: 'home', label: 'Início' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'about', label: 'Sobre' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: mob ? '12px 18px' : '14px 40px',
      background: 'rgba(13, 27, 46, 0.82)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <img src={window.NERTA_LOGO_DARK} alt="nerta" height={mob ? 28 : 34}
             style={{ cursor: 'pointer' }} onClick={() => onNav('home')} />
        {!mob && (
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--provisao-gold)',
            paddingLeft: 16, borderLeft: '1px solid var(--border-subtle)',
          }}>Distribuidor Oficial Provisão</span>
        )}
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: mob ? 16 : 32 }}>
        {links.map((l) => (
          <button key={l.id} onClick={() => onNav(l.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: mob ? 13 : 13.5, fontWeight: 500,
            letterSpacing: '0.01em',
            color: current === l.id ? 'var(--white)' : 'var(--muted-text)',
            padding: '6px 0',
            borderBottom: current === l.id ? '2px solid var(--nerta-blue)' : '2px solid transparent',
            transition: 'color var(--duration-fast)',
          }}>{l.label}</button>
        ))}
        {!mob && <NHButton size="sm" variant="secondary" onClick={() => onNav('catalog')}>Ver produtos</NHButton>}
      </nav>
    </header>
  );
}
window.Header = Header;
