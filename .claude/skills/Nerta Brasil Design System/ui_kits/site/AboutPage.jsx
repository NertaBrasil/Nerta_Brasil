// About page — "Sobre Nós". História belga, tecnologia, parceria Provisão.
const NAB = window.NertaBrasilDesignSystem_82f464;

// Reusable image placeholder (Nerta photography slots in here later).
function ImageSlot({ label, ratio = '4 / 3', icon = 'image' }) {
  return (
    <div style={{
      aspectRatio: ratio, width: '100%',
      borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
      background: 'radial-gradient(120% 100% at 50% 20%, #163258 0%, #0D1B2E 72%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 12, color: 'var(--navy-border)',
    }}>
      <i data-lucide={icon} style={{ width: 40, height: 40 }}></i>
      <span style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

function AboutPage({ onNav }) {
  const { Button, Badge, KpiStat, AccentBlock } = NAB;
  const mob = window.useIsMobile();
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const pillars = [
    { n: '01', t: 'Origem belga', icon: 'flask-conical', d: 'Mais de 50 anos formulando química automotiva em laboratórios na Bélgica. Fórmulas próprias, nano-moleculares, desenvolvidas para o ambiente industrial mais exigente.' },
    { n: '02', t: 'Líder global', icon: 'globe', d: 'Presente em mais de 60 países, com certificações ISO 9001 e 14001. Referência mundial em Car & Truckwash, agora chegando ao Brasil com importação oficial.' },
    { n: '03', t: 'Distribuição exclusiva', icon: 'handshake', d: 'A Provisão Comércio Internacional é a distribuidora oficial exclusiva no Brasil — estoque nacional, suporte técnico e atendimento B2B especializado.' },
  ];

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-gradient)', padding: mob ? '52px 20px 56px' : '88px 40px 80px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
          background: 'radial-gradient(55% 110% at 82% 8%, #5BB8F5 0, transparent 55%), radial-gradient(50% 90% at 6% 94%, #1DB87E 0, transparent 55%)' }} />
        <div style={{ position: 'relative', maxWidth: 1120, margin: '0 auto' }}>
          <Badge tone="gold">Nerta Belgium × Provisão · Brasil 2026</Badge>
          <h1 style={{ fontSize: mob ? 32 : 50, lineHeight: 1.06, margin: '20px 0 0', maxWidth: 760 }}>
            Química de <span style={{ color: 'var(--sky-blue)' }}>laboratório</span>, não de prateleira.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--muted-text)', margin: '22px 0 0', maxWidth: 600 }}>
            A Nerta é uma marca belga líder global em limpeza química para Car & Truckwash. Cada
            produto nasce de pesquisa de laboratório e chega ao Brasil pela distribuição exclusiva
            da Provisão Comércio Internacional.
          </p>
        </div>
      </section>

      {/* INTRO image + text */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '48px 20px' : '72px 40px', display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? 28 : 56, alignItems: 'center' }}>
        <ImageSlot label="Laboratório / planta Nerta" icon="microscope" ratio="4 / 3" />
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sky-blue)', marginBottom: 12 }}>Quem somos</div>
          <h2 style={{ fontSize: 30, marginBottom: 18 }}>Tecnologia europeia para um mercado que merece mais</h2>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--muted-text)', maxWidth: 480, marginBottom: 20 }}>
            Enquanto boa parte do mercado nacional trabalha com soluções diluídas de fábrica, a Nerta
            entrega detergentes superconcentrados — você dilui de 3 a 20% e reduz o custo real por
            lavagem muito abaixo dos concorrentes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <AccentBlock accent="blue" title="Performance comprovada">Touchless real, ação alcalina de alto desempenho para frotas, agro e detailing.</AccentBlock>
            <AccentBlock accent="teal" title="Compromisso técnico">Cada afirmação acompanhada de dado: diluição, custo/lavagem e certificação.</AccentBlock>
          </div>
        </div>
      </section>

      {/* KPI band */}
      <section style={{ background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '44px 20px' : '56px 40px', display: 'flex', gap: mob ? '28px 40px' : 56, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <KpiStat value="50+" label="anos de tecnologia belga" tone="teal" />
          <KpiStat value="60+" label="países atendidos" tone="blue" />
          <KpiStat value="ISO" label="9001 · 14001 certificada" tone="teal" />
          <KpiStat value="1" label="distribuidor exclusivo no Brasil" tone="blue" />
        </div>
      </section>

      {/* Pillars — editorial numbering */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '48px 20px' : '72px 40px' }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--provisao-gold)', marginBottom: 10 }}>A marca</div>
        <h2 style={{ fontSize: 30, marginBottom: 36 }}>Três pilares de credibilidade</h2>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)', gap: 24 }}>
          {pillars.map((p) => (
            <div key={p.n} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, lineHeight: 1, color: 'var(--sky-blue)', letterSpacing: '-0.02em' }}>{p.n}</span>
                <i data-lucide={p.icon} style={{ width: 26, height: 26, color: 'var(--teal)' }}></i>
              </div>
              <h3 style={{ fontSize: 19, marginBottom: 10 }}>{p.t}</h3>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted-text)' }}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery — Nerta image slots */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '0 20px 48px' : '0 40px 72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '2fr 1fr', gap: mob ? 14 : 22 }}>
          <ImageSlot label="Frota / aplicação em campo" icon="truck" ratio="16 / 9" />
          <ImageSlot label="Espuma ativa em ação" icon="droplet" ratio="16 / 9" />
        </div>
      </section>

      {/* Partnership lockup — Nerta + Provisão SEPARADOS */}
      <section style={{ background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '48px 20px' : '64px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 520 }}>
            <h2 style={{ fontSize: 26, marginBottom: 14 }}>Uma parceria de marca e distribuição</h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted-text)' }}>
              A tecnologia é da Nerta Belgium. A operação, o estoque e o atendimento no Brasil são da
              Provisão Comércio Internacional. Duas marcas, sempre identificadas e separadas.
            </p>
            <div style={{ marginTop: 24 }}>
              <Button variant="primary" size="lg" onClick={() => onNav('catalog')}>Conhecer o catálogo</Button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <img src={window.NERTA_LOGO_DARK} alt="nerta" height="38" />
            <span style={{ width: 1, height: 44, background: 'var(--border-subtle)' }}></span>
            <img src={window.PROVISAO_LOGO} alt="Provisão Comércio Internacional" height="42" />
          </div>
        </div>
      </section>
    </div>
  );
}
window.AboutPage = AboutPage;
