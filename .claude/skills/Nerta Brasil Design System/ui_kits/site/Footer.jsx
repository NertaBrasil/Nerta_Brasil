// Site footer — Nerta + Provisão logos visually SEPARATED (brand rule).
function Footer() {
  const mob = window.useIsMobile();
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-sunken)',
      padding: mob ? '36px 20px 28px' : '44px 40px 36px',
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 40, flexWrap: 'wrap',
      }}>
        <div style={{ maxWidth: 320 }}>
          <img src={window.NERTA_LOGO_DARK} alt="nerta" height="32" />
          <p style={{ margin: '16px 0 0', fontSize: 12.5, lineHeight: 1.6, color: 'var(--muted-text)' }}>
            Tecnologia química europeia de alta performance para frotas, agro e detailing.
            Marca belga líder global em Car &amp; Truckwash.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: 12 }}>Produtos</div>
            {['Linha Frotas', 'Linha Agro', 'Linha Detailing', 'Linha Animal'].map((t) => (
              <div key={t} style={{ fontSize: 13, color: 'var(--light-gray)', marginBottom: 8 }}>{t}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: 12 }}>Distribuição</div>
            <div style={{ fontSize: 13, color: 'var(--light-gray)', marginBottom: 8 }}>Atendimento B2B</div>
            <div style={{ fontSize: 13, color: 'var(--light-gray)', marginBottom: 8 }}>Material de revenda</div>
            <div style={{ fontSize: 13, color: 'var(--light-gray)', marginBottom: 8 }}>WhatsApp comercial</div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1120, margin: '36px auto 0', paddingTop: 24,
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 11.5, color: 'var(--muted-text)' }}>© 2026 Nerta · Produzido na Bélgica · Bélgica → Portugal → Brasil</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-text)' }}>Distribuição exclusiva</span>
          <img src={window.PROVISAO_LOGO} alt="Provisão Comércio Internacional" height="34" />
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
