// /admin/produtos/novo + /[id] — product form with crop + gallery.
const NPF = window.NertaBrasilDesignSystem_82f464;

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, marginBottom: 18 }}>{title}</h3>
      {children}
    </div>
  );
}

function ProdutoFormPage({ editing = false }) {
  const { Button, Input, Select } = NPF;
  const Switch = window.Switch, Modal = window.Modal;
  const mob = window.useIsMobile(900);
  const seed = editing ? window.ADMIN_PRODUCTS[0] : null;

  const [name, setName] = React.useState(seed ? seed.name : '');
  const [slug, setSlug] = React.useState(seed ? window.slugify(seed.name) : '');
  const [slugEdited, setSlugEdited] = React.useState(false);
  const [tags, setTags] = React.useState(seed ? seed.attributes : ['Touchless']);
  const [active, setActive] = React.useState(seed ? seed.active : true);
  const [featured, setFeatured] = React.useState(seed ? seed.featured : false);
  const [preview, setPreview] = React.useState(false);
  const [cropOpen, setCropOpen] = React.useState(false);
  const [images, setImages] = React.useState(editing ? [{ id: 1, icon: 'sparkles' }, { id: 2, icon: 'droplet' }] : []);
  const dragIdx = React.useRef(null);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  React.useEffect(() => { if (!slugEdited) setSlug(window.slugify(name)); }, [name]);

  const cats = window.ADMIN_CATEGORIES.map((c) => c.name);
  const addImage = () => { setImages((im) => [...im, { id: Date.now(), icon: 'image' }]); setCropOpen(false); };
  const onDrop = (i) => {
    const from = dragIdx.current;
    if (from === null || from === i) return;
    setImages((im) => { const a = [...im]; const [m] = a.splice(from, 1); a.splice(i, 0, m); return a; });
    dragIdx.current = null;
  };

  return (
    <div style={{ maxWidth: 820 }}>
      <a href="Nerta-Admin-Produtos.html" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--muted-text)', fontSize: 13, marginBottom: 18 }}>
        <i data-lucide="arrow-left" style={{ width: 15, height: 15 }}></i> Voltar para produtos
      </a>

      <Section title="Informações básicas">
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div>
            <Input label="Nome do produto" value={name} onChange={(e) => setName(e.target.value)} placeholder="Active Diamond Foam" />
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--muted-text)' }}>/produto/</span>
              <input value={slug} onChange={(e) => { setSlug(window.slugify(e.target.value)); setSlugEdited(true); }}
                style={{ flex: 1, height: 30, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--sky-blue)', fontFamily: 'var(--font-body)', fontSize: 12, padding: '0 10px', outline: 'none' }} />
            </div>
          </div>
          <Input label="Linha" defaultValue={seed ? seed.line : ''} placeholder="Linha Frotas" />
          <Select label="Categoria" placeholder="Selecione" options={cats} defaultValue={seed ? seed.category : ''} />
          <Input label="Diluição" defaultValue={seed ? seed.dilution : ''} placeholder="3–5%" />
        </div>
      </Section>

      <Section title="Descrição">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={() => setPreview(!preview)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', color: preview ? 'var(--sky-blue)' : 'var(--muted-text)', cursor: 'pointer', fontSize: 11.5, height: 30, padding: '0 12px' }}>
            <i data-lucide={preview ? 'pencil' : 'eye'} style={{ width: 13, height: 13 }}></i>{preview ? 'Editar' : 'Preview'}
          </button>
        </div>
        {preview ? (
          <div style={{ minHeight: 120, padding: 14, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--light-gray)', fontSize: 14, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--white)' }}>Formulação alcalina superconcentrada</strong> que dissolve sujeiras severas <em>sem necessidade de esfregação</em>.
          </div>
        ) : (
          <textarea defaultValue={"**Formulação alcalina superconcentrada** que dissolve sujeiras severas *sem necessidade de esfregação*."}
            style={{ width: '100%', minHeight: 120, padding: 14, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
        )}
        <div style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 7 }}>Markdown suportado · **negrito**, *itálico*, listas</div>
      </Section>

      <Section title="Atributos & badges">
        <window.FieldLabel hint="aparecem como pills no card do produto">Atributos</window.FieldLabel>
        <window.TagInput tags={tags} onChange={setTags} />
      </Section>

      <Section title="Comercial & estoque">
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
          <Input label="Preço (R$)" type="number" defaultValue={seed ? seed.price : ''} placeholder="489.90" />
          <Input label="Estoque" type="number" defaultValue={seed ? seed.stock : ''} hint="0 desabilita o botão de compra" placeholder="24" />
          <Input label="URL do Mercado Livre" defaultValue={editing ? 'https://mercadolivre.com.br/...' : ''} placeholder="https://..." />
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 20, flexWrap: 'wrap' }}>
          <Switch checked={active} onChange={setActive} label="Ativo no catálogo" />
          <Switch checked={featured} onChange={setFeatured} label="Destaque na home" />
        </div>
      </Section>

      <Section title="Imagens do produto">
        <div style={{ fontSize: 12.5, color: 'var(--muted-text)', marginBottom: 16 }}>
          Sem limite de imagens. Cada uma passa por recorte 1:1 antes de salvar. Arraste para reordenar — a primeira é a <strong style={{ color: 'var(--light-gray)' }}>Principal</strong> (capa do card).
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
          {images.map((img, i) => (
            <div key={img.id} draggable
              onDragStart={() => { dragIdx.current = i; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid ' + (i === 0 ? 'var(--nerta-blue)' : 'var(--border-subtle)'), background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-border)', cursor: 'grab' }}>
              <i data-lucide={img.icon} style={{ width: 34, height: 34 }}></i>
              {i === 0 && <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', background: 'var(--nerta-blue)', borderRadius: 999, padding: '3px 8px' }}>Principal</span>}
              <button onClick={() => setImages((im) => im.filter((x) => x.id !== img.id))} style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 999, background: 'var(--scrim)', border: '1px solid var(--border-subtle)', color: '#E5634D', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <i data-lucide="trash-2" style={{ width: 13, height: 13 }}></i>
              </button>
            </div>
          ))}
          <button onClick={() => setCropOpen(true)} style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)', background: 'transparent', color: 'var(--muted-text)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <i data-lucide="upload" style={{ width: 24, height: 24 }}></i>
            <span style={{ fontSize: 11.5 }}>Adicionar</span>
          </button>
        </div>
      </Section>

      {/* sticky save bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, position: 'sticky', bottom: 0, padding: '16px 0', background: 'linear-gradient(transparent, var(--navy-deep) 30%)' }}>
        <Button variant="secondary" href="Nerta-Admin-Produtos.html">Cancelar</Button>
        <Button variant="primary" leftIcon={<i data-lucide="check" style={{ width: 16, height: 16 }}></i>}>{editing ? 'Salvar alterações' : 'Criar produto'}</Button>
      </div>

      <Modal open={cropOpen} hideFooter width={400} onClose={() => setCropOpen(false)}>
        <window.ImageCropper onConfirm={addImage} onCancel={() => setCropOpen(false)} />
      </Modal>
    </div>
  );
}
window.ProdutoFormPage = ProdutoFormPage;
