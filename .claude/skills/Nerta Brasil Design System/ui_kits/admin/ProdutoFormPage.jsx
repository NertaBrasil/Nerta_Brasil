// /admin/produtos/novo + /[id] — product form (criar ou editar).
// Campos: nome, linha, descrição curta, descrição completa, ficha técnica,
//         categoria (obrigatória), estoque (int >= 0), status, link ML, slug.
// Slug: auto-gerado do nome, editável manualmente, erro inline de duplicidade.
// Imagens: fora desta tela — seção marcada explicitamente.
// Estados: salvando, erro de rede.
const NPF = window.NertaBrasilDesignSystem_82f464;

function Section({ title, children, accent }) {
  return (
    <div style={{
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderLeft: accent ? '4px solid ' + accent : '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', padding: '22px 24px', marginBottom: 20,
    }}>
      <h3 style={{ fontSize: 15, marginBottom: 18, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h3>
      {children}
    </div>
  );
}

function FieldRow({ children, cols = 2, mob }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : ('repeat(' + cols + ', 1fr)'), gap: 16 }}>
      {children}
    </div>
  );
}

function ProdutoFormPage({ editing = false }) {
  const { Button, Input, Select } = NPF;
  const mob = window.useIsMobile(900);
  const seed = editing ? window.ADMIN_PRODUCTS[0] : null;
  const existingSlugs = window.ADMIN_PRODUCTS.filter(p => !editing || p.id !== 'p1').map(p => p.slug);

  // Identificação
  const [name, setName] = React.useState(seed ? seed.name : '');
  const [line, setLine] = React.useState(seed ? seed.line : '');
  const [category, setCategory] = React.useState(seed ? seed.category : '');
  const [slug, setSlug] = React.useState(seed ? seed.slug : '');
  const [slugManual, setSlugManual] = React.useState(false);
  const [mlUrl, setMlUrl] = React.useState(seed ? seed.mlUrl : '');

  // Textos
  const [shortDesc, setShortDesc] = React.useState(seed ? seed.shortDesc : '');
  const [fullDesc, setFullDesc] = React.useState(seed ? seed.fullDesc : '');
  const [techSheet, setTechSheet] = React.useState(seed ? seed.techSheet : '');
  const [previewMode, setPreviewMode] = React.useState(false);

  // Atributos
  const [tags, setTags] = React.useState(seed ? seed.attributes : []);

  const [dilution, setDilution] = React.useState(seed ? seed.dilution : '');

  // Comercial
  const [stock, setStock] = React.useState(seed ? String(seed.stock) : '');
  const [active, setActive] = React.useState(seed ? seed.active : true);
  const [featured, setFeatured] = React.useState(seed ? seed.featured : false);

  // Estados de UI
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [networkErr, setNetworkErr] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  // Auto-gerar slug do nome
  React.useEffect(() => {
    if (!slugManual) setSlug(window.slugify(name));
  }, [name, slugManual]);

  const slugDuplicate = slug && existingSlugs.includes(slug);
  const stockInt = parseInt(stock, 10);
  const stockError = stock !== '' && (isNaN(stockInt) || stockInt < 0 || !Number.isInteger(Number(stock)));

  const cats = window.ADMIN_CATEGORIES.map((c) => c.name);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Nome obrigatório';
    if (!category) e.category = 'Categoria obrigatória';
    if (stock === '') e.stock = 'Estoque obrigatório';
    else if (stockError) e.stock = 'Valor inválido — inteiro maior ou igual a 0';
    if (slugDuplicate) e.slug = 'Slug já existe — edite manualmente';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 1100);
  };

  const FieldError = ({ msg }) => msg
    ? <div style={{ marginTop: 6, fontSize: 11.5, color: '#E5634D', display: 'flex', alignItems: 'center', gap: 5 }}>
        <i data-lucide="alert-circle" style={{ width: 13, height: 13 }}></i>{msg}
      </div>
    : null;

  return (
    <div style={{ maxWidth: 1040 }}>
      <a href="produtos.html" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--muted-text)', fontSize: 13, marginBottom: 20, textDecoration: 'none' }}>
        <i data-lucide="arrow-left" style={{ width: 14, height: 14 }}></i> Voltar para produtos
      </a>

      <window.NetworkError message={networkErr} onDismiss={() => setNetworkErr(null)} />

      {/* ── 1. IDENTIFICAÇÃO ── */}
      <Section title="Identificação" accent="var(--nerta-blue)">
        <window.DemoBar actions={[
          { label: 'Simular erro ao salvar', action: () => setNetworkErr('Erro ao salvar — verifique a conexão e tente novamente.') },
          { label: 'Simular slug duplicado', action: () => { setName('Active Diamond Foam'); setSlugManual(false); } },
        ]} />
        <FieldRow cols={2} mob={mob}>
          <div>
            <window.FieldLabel>Nome do produto <span style={{ color: '#E5634D' }}>*</span></window.FieldLabel>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Active Diamond Foam"
              style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid ' + (errors.name ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            <FieldError msg={errors.name} />
          </div>
          <div>
            <window.FieldLabel hint="auto-gerado do nome, editável">Slug / URL</window.FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', height: 42, background: 'var(--surface-sunken)', border: '1px solid ' + (slugDuplicate ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <span style={{ padding: '0 10px 0 14px', fontSize: 12, color: 'var(--muted-text)', whiteSpace: 'nowrap' }}>/produto/</span>
              <input value={slug}
                onChange={(e) => { setSlug(window.slugify(e.target.value)); setSlugManual(true); }}
                style={{ flex: 1, height: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--sky-blue)', fontFamily: 'var(--font-body)', fontSize: 13, paddingRight: 10 }} />
              {slugManual && (
                <button onClick={() => { setSlugManual(false); setSlug(window.slugify(name)); }} title="Resetar para auto"
                  style={{ padding: '0 10px', background: 'none', border: 'none', color: 'var(--muted-text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                  <i data-lucide="rotate-ccw" style={{ width: 13, height: 13 }}></i>
                </button>
              )}
            </div>
            {slugDuplicate && <FieldError msg="Slug já existe — edite manualmente ou use outro nome" />}
          </div>
        </FieldRow>

        <div style={{ marginTop: 16 }}>
          <FieldRow cols={2} mob={mob}>
            <div>
              <window.FieldLabel>Linha comercial</window.FieldLabel>
              <input value={line} onChange={(e) => setLine(e.target.value)}
                placeholder="Linha Frotas"
                style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <window.FieldLabel>Diluição recomendada</window.FieldLabel>
              <input value={dilution} onChange={(e) => setDilution(e.target.value)}
                placeholder="3–5%"
                style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <window.FieldLabel>Categoria <span style={{ color: '#E5634D' }}>*</span></window.FieldLabel>
              <div style={{ position: 'relative' }}>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setErrors(err => ({ ...err, category: null })); }}
                  style={{ width: '100%', height: 42, padding: '0 34px 0 14px', appearance: 'none', WebkitAppearance: 'none', background: 'var(--surface-sunken)', border: '1px solid ' + (errors.category ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', color: category ? 'var(--white)' : 'var(--muted-text)', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', boxSizing: 'border-box' }}>
                  <option value="" style={{ background: '#112644' }}>Selecione a categoria</option>
                  {cats.map(c => <option key={c} value={c} style={{ background: '#112644' }}>{c}</option>)}
                </select>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-text)', fontSize: 10 }}>▾</span>
              </div>
              <FieldError msg={errors.category} />
            </div>
          </FieldRow>
        </div>
      </Section>

      {/* ── 2. TEXTOS ── */}
      <Section title="Textos do produto">
        <div style={{ marginBottom: 16 }}>
          <window.FieldLabel hint="exibida no card do catálogo (máx. 120 car.)">Descrição curta</window.FieldLabel>
          <input value={shortDesc} onChange={(e) => setShortDesc(e.target.value.slice(0, 120))}
            placeholder="Formulação alcalina superconcentrada para lavagem touchless..."
            style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          <div style={{ textAlign: 'right', fontSize: 11, color: shortDesc.length >= 100 ? '#E5A03D' : 'var(--muted-text)', marginTop: 4 }}>{shortDesc.length}/120</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <window.FieldLabel>Descrição completa</window.FieldLabel>
            <button onClick={() => setPreviewMode(!previewMode)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', color: previewMode ? 'var(--sky-blue)' : 'var(--muted-text)', cursor: 'pointer', fontSize: 11, height: 28, padding: '0 10px' }}>
              <i data-lucide={previewMode ? 'pencil' : 'eye'} style={{ width: 12, height: 12 }}></i>
              {previewMode ? 'Editar' : 'Preview'}
            </button>
          </div>
          {previewMode ? (
            <div style={{ minHeight: 110, padding: 14, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--light-gray)', fontSize: 13.5, lineHeight: 1.7 }}>
              {fullDesc || <span style={{ color: 'var(--muted-text)', fontStyle: 'italic' }}>Sem conteúdo.</span>}
            </div>
          ) : (
            <textarea value={fullDesc} onChange={(e) => setFullDesc(e.target.value)}
              placeholder={"**Formulação alcalina superconcentrada** que dissolve sujeiras severas *sem necessidade de esfregação*.\n\nDesenvolvida para sistemas de lavagem touchless..."}
              style={{ width: '100%', minHeight: 110, padding: 14, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          )}
          <div style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 5 }}>Markdown: **negrito**, *itálico*, listas com -</div>
        </div>

        <div>
          <window.FieldLabel hint="dados técnicos do produto, ex: pH, diluição, embalagem">Ficha técnica</window.FieldLabel>
          <textarea value={techSheet} onChange={(e) => setTechSheet(e.target.value)}
            placeholder={"pH (concentrado): 13,2\nDiluição recomendada: 3–5%\nAspecto: líquido viscoso azul\nDensidade: 1,05 g/cm³\nValidade: 24 meses\nEmbalagem: bombona 25 L"}
            style={{ width: '100%', minHeight: 120, padding: 14, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: '"Courier New", monospace', fontSize: 12.5, lineHeight: 1.8, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          <div style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 5 }}>Uma propriedade por linha, formato livre.</div>
        </div>
      </Section>

      {/* ── 3. ATRIBUTOS ── */}
      <Section title="Atributos e badges">
        <window.FieldLabel hint="aparecem como pills no card do produto">Atributos</window.FieldLabel>
        <window.TagInput tags={tags} onChange={setTags} placeholder="Digite e pressione Enter..." />
      </Section>

      {/* ── 4. COMERCIAL & ESTOQUE ── */}
      <Section title="Comercial e estoque">
        <FieldRow cols={2} mob={mob}>
          <div>
            <window.FieldLabel>Estoque (unidades) <span style={{ color: '#E5634D' }}>*</span></window.FieldLabel>
            <input type="number" min="0" step="1" value={stock} onChange={(e) => { setStock(e.target.value); setErrors(err => ({ ...err, stock: null })); }}
              placeholder="24"
              style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid ' + (errors.stock || stockError ? '#E5634D' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            {(errors.stock || stockError) && <FieldError msg={errors.stock || 'Deve ser um inteiro maior ou igual a 0'} />}
            {stock !== '' && !stockError && stockInt === 0 && (
              <div style={{ marginTop: 6, fontSize: 11.5, color: '#E5A03D', display: 'flex', alignItems: 'center', gap: 5 }}>
                <i data-lucide="info" style={{ width: 13, height: 13 }}></i>
                Estoque 0 — botão "Comprar" desabilitado no site público.
              </div>
            )}
          </div>
          <div>
            <window.FieldLabel hint="abre em nova aba">Link Mercado Livre</window.FieldLabel>
            <input value={mlUrl} onChange={(e) => setMlUrl(e.target.value)}
              placeholder="https://www.mercadolivre.com.br/..."
              type="url"
              style={{ width: '100%', height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </FieldRow>

        <div style={{ display: 'flex', gap: 32, marginTop: 22, flexWrap: 'wrap', padding: '18px 20px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <window.Switch checked={active} onChange={setActive} label="Ativo no catálogo" />
            <div style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 5, marginLeft: 54 }}>Independente do estoque</div>
          </div>
          <div>
            <window.Switch checked={featured} onChange={setFeatured} label="Destaque na home" />
            <div style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 5, marginLeft: 54 }}>
              {featured && !active
                ? <span style={{ color: '#E5A03D', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i data-lucide="alert-triangle" style={{ width: 12, height: 12 }}></i>
                    Produto inativo não aparece na home
                  </span>
                : 'Só aparece na home se também ativo'}
            </div>
          </div>
        </div>
      </Section>

      {/* ── 5. IMAGENS — FORA DESTA TELA ── */}
      <div style={{
        padding: '18px 22px', marginBottom: 20,
        background: 'rgba(30,62,90,0.3)', border: '1px dashed var(--border-strong)',
        borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{ width: 36, height: 36, flex: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-text)' }}>
          <i data-lucide="image" style={{ width: 18, height: 18 }}></i>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--light-gray)', marginBottom: 4 }}>Galeria de imagens — fora desta tela</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted-text)', lineHeight: 1.6 }}>
            Upload e gestão da galeria de produto (recorte 1:1, reordenação, imagem principal) serão gerenciados em tela dedicada, acessível pelo botão "Imagens" na listagem de produtos.
          </div>
        </div>
      </div>

      {/* ── Barra de ação fixa ── */}
      <div style={{
        position: 'sticky', bottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 12, padding: '14px 0 2px',
        background: 'linear-gradient(transparent, var(--navy-deep) 32%)',
      }}>
        <div>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--teal)' }}>
              <i data-lucide="check-circle" style={{ width: 16, height: 16 }}></i>
              {editing ? 'Alterações salvas' : 'Produto criado'}
            </div>
          )}
          {networkErr && <div style={{ fontSize: 12, color: '#E5634D' }}>{networkErr}</div>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" href="produtos.html">Cancelar</Button>
          <Button variant="primary" onClick={handleSave}
            leftIcon={saving ? <window.Spinner size={15} color="#fff" /> : <i data-lucide="check" style={{ width: 15, height: 15 }}></i>}>
            {saving ? 'Salvando…' : (editing ? 'Salvar alterações' : 'Criar produto')}
          </Button>
        </div>
      </div>
    </div>
  );
}
window.ProdutoFormPage = ProdutoFormPage;
