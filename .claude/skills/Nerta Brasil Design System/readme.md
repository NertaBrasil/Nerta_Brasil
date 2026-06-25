# Nerta Brasil — Design System

Sistema de design da **Nerta Brasil**, marca belga líder global em limpeza química para Car & Truckwash. Identidade visual premium B2B: fundo navy escuro, minimalismo corporativo estilo consultoria, posicionamento de tecnologia química europeia superior às soluções nacionais.

> *"Tecnologia química europeia de alta performance para um mercado que ainda utiliza soluções inferiores."*

**Stack-alvo do produto:** Next.js App Router · Supabase (auth + banco + storage) · TypeScript · Tailwind CSS. O site é **vitrine + SEO**; o checkout é 100% no Mercado Livre.

## Fontes deste sistema
- **`uploads/Nerta_Identidade_Visual_2026.pdf`** — guia de identidade visual consolidado (10 seções: essência, paleta, tipografia, elementos gráficos, arquétipos, tom de voz, fotografia, diretrizes por canal, do & don't, anatomia do card de produto). **Esta é a fonte canônica** de tudo neste sistema.
- Nenhum codebase ou Figma foi anexado. Não há binários de logo nem fotografia de produto no PDF — ver **Caveats**.

---

## O negócio em uma página
- **Quem:** Nerta Brasil. Lançamento nacional 2026.
- **O quê:** detergentes concentrados em bombonas de 25L (diluição 3–20%) para **Frotas**, **Agro**, **Detailing** e **Animal**.
- **Posicionamento:** química de laboratório premium, não produto de prateleira. Credibilidade antes de catálogo.
- **Regras de produto (MVP):** usuário final **não** faz login; só `/admin` é protegido (Supabase Auth). Botão "Comprar no Mercado Livre" abre em nova aba e dispara GA/Pixel. `stock === 0` → botão desabilitado "Produto Indisponível", sem redirect. Flags `featured` (carrossel home) e `active` (visível no catálogo). **Sem carrinho, sem checkout próprio.**

---

## CONTENT FUNDAMENTALS — como a marca escreve

**Idioma:** português do Brasil, registro corporativo. **Tom:** técnico sem ser hermético, assertivo sem ser arrogante, confiante sem ser informal, europeu sem ser distante, premium sem ser inacessível.

**Pessoa:** institucional/terceira pessoa ("a marca afirma", "a formulação dissolve"). Fala-se de **performance e dado técnico**, não de promessa vazia. Nunca "você" coloquial; quando há chamada à ação, é direta e seca ("Explorar catálogo", "Comprar no Mercado Livre").

**Casing:** títulos em capitalização natural (não Title Case forçado). Labels de seção e badges em **CAIXA ALTA** com tracking +0.08em ("DETERGENTE ESPUMA ATIVA", "OPORTUNIDADE 2026"). Nomes de produto em bold, capitalização natural.

**Emoji:** **não.** O PDF usa alguns emoji apenas internamente para marcar arquétipos — nunca em material de cliente. Em produção, zero emoji.

**Prova sempre:** toda afirmação carrega dado — diluição, custo/lavagem, certificação ISO, anos, países. Números grandes são argumento visual.

| ✓ Correto | ✗ Incorreto |
|---|---|
| "Diluição de 3–5%. O menor custo real por lavagem do mercado." | "Super produto barato e eficiente para lavar tudo!" |
| "Formulação alcalina superconcentrada. Tecnologia touchless certificada." | "O melhor do mercado, testado e aprovado por todos!" |

**Vocabulário recorrente:** superconcentrado, touchless, alcalino, custo real por lavagem, nano-molecular, frotas, agro, detailing, distribuição exclusiva, tecnologia belga.

---

## VISUAL FOUNDATIONS

**Cor & vibe.** O sistema **vive no escuro**. Fundo **Navy Deep `#0D1B2E` é inegociável** — nenhuma peça branca ou clara. Azul Nerta `#1E7FC8` é a cor primária (CTAs, links, highlights). Dourado `#C9951A` para badges institucionais e selos de parceiro — nunca decorativo. Teal `#1DB87E` só para ícones de benefício e checks. Sky Blue `#5BB8F5` para palavras-chave e numeração editorial. Máximo de 3 cores primárias por componente. Proibido: vermelho/laranja/roxo de destaque, neon/glow, fibra de carbono (remete a tuning).

**Atenção aos hexadecimais.** Azul é `#1E7FC8` (royal quente), **não** `#0796D1` (ciano frio). Dourado é `#C9951A` (quente, saturado), **não** `#C9A64E` (bege pastel). O tom errado destrói o peso executivo.

**Tipografia.** Sans-serif moderna. Display = **Plus Jakarta Sans** (≈ Montserrat/Avenir), corpo = **Inter**. Headlines Bold 700 com tracking **−0.02em**, brancas. Hierarquia rigorosa de 3 níveis. Corpo em Muted Text `#8A9BB0` (nunca branco puro — contraste agressivo é evitado), line-height 1.6. KPIs grandes 36–56px em teal ou azul.

**Backgrounds.** Sólido navy ou **gradiente diagonal 135° `#0D1B2E → #163258`** em heroes. Texturas de **ondas/partículas de espuma** orgânicas, opacidade ≤ 8%, nunca dominantes. Sem padrões pesados, sem fibra de carbono.

**Cards.** Fundo `#112644` (Navy Mid), borda `#1E3A5A` fina (0.5–1px), raio 8–12px. **Regra absoluta: nunca card claro.** Sombras sutis para profundidade (`0 6px 20px rgba(8,19,32,.45)`) — **nunca glow**. Fotos de produto **flutuam sem sombra**.

**O motivo assinatura: left-border accent.** Barra esquerda de 3–4px (azul = performance, teal = tecnologia/benefício, dourado = institucional/parceiro) aplicada a blocos de destaque. É o elemento mais recorrente do PDF e o que mais identifica o estilo editorial. *(Nota: "card com borda esquerda colorida" costuma ser evitado como cliché — aqui é um motivo de marca documentado e intencional, então usamos.)*

**Numeração editorial.** "01 / 02 / 03" em Sky Blue, 40–60px, estilo consultoria premium (McKinsey/BCG/Deloitte).

**Badges / pills.** Bordas finas azul ou dourado, caixa alta, +0.08em, 10–11px, acima de headings.

**Animação.** Sóbria. Fades e lifts curtos (`translateY(-2/-3px)` no hover de card), contadores animados em KPIs. Easing padrão `cubic-bezier(0.4,0,0.2,1)`, 140–360ms. Sem bounces, sem loops decorativos infinitos.

**Estados.** Hover: clarear fundo do botão / lift do card / borda mais clara. Press: `scale(0.97)`. Foco: ring azul `0 0 0 3px rgba(91,184,245,.55)`. Disabled: fundo `#1A2A40`, texto `#5A6B82`.

**Layout & espaçamento.** Generoso. Base 4px. Container ~1120–1200px. Header sticky com blur. Footer com logo Nerta.

**Imagery.** Caminhões/frotas limpos, máquinas agrícolas, detailing com espuma ativa, ambientes industriais organizados; iluminação controlada, paleta fria/escura coerente com o navy. Produto **recortado, fundo removido, float sobre navy, sem sombra** (padrão Apple/Dyson/BASF). Evitar foto amadora, lava-rápido de bairro, banco de imagens genérico.

---

## ICONOGRAPHY

O PDF não traz um icon set próprio; descreve **ícones de benefício em teal** (touchless, agro, pH, checkmarks). **Substituição:** usamos **[Lucide](https://lucide.dev)** via CDN (`lucide@0.460.0`) — stroke de 2px, geometria limpa e técnica, a melhor correspondência ao tom industrial/laboratório. ⚠️ *Flag: substituição de icon set — se a marca adotar um conjunto próprio, troque aqui.*

**Uso:** ícones de benefício em **teal `#1DB87E`**; ícones funcionais/produto em azul ou muted. Mapeamento sugerido: `sparkles`=touchless, `truck`=frotas, `tractor`=agro, `flask-conical`=química, `droplet`=água/shampoo, `badge-check`/`shield-check`=certificação, `leaf`=biodegradável, `gauge`=pH, `package`=bombona 25L, `external-link`=Mercado Livre. **Sem emoji. Sem unicode como ícone.** A gota d'água do logo é o símbolo-âncora — nunca substituir por ícone genérico de lavagem.

---

## Índice / Manifesto

**Raiz**
- `styles.css` — ponto de entrada global (só `@import`). Consumidores linkam este arquivo.
- `readme.md` — este guia. · `SKILL.md` — invocação como Agent Skill.

**`tokens/`** — `fonts.css` (Google Fonts), `colors.css`, `typography.css`, `spacing.css` (espaço/raio/borda/sombra/motion), `base.css` (reset + canvas navy).

**`assets/`** — `nerta-logo.svg` (pill), `nerta-logo-dark.svg` (sobre navy). ⚠️ Recriações em SVG (sem binário oficial).

**`components/`**
- `core/` — **Button** (primary/partner/secondary/ghost/**danger**, estado "Produto Indisponível"), **Badge**, **Card**, **AccentBlock**, **Switch** (toggle), **Modal** (confirmação/scrim).
- `product/` — **ProductCard** (anatomia do card de catálogo, PDF §10), **KpiStat**.
- `forms/` — **Input**, **Select** (área `/admin`).

**`ui_kits/`**
- `site/` — vitrine interativa: Landing · Catálogo · Produto · Sobre · footer/header. (`index.html` + telas JSX + `data.js`)
- `admin/` — painel administrativo completo: **login**, **Produtos** (listagem), **Produto Form** (tags, cropper 1:1, galeria), **Categorias**, **Destaques**, **Usuários**. Casca compartilhada `AdminShell.jsx` + `widgets.jsx` + `admin-data.js`. Ciente de papel (admin/editor).

**`guidelines/`** — cards de especímen do Design System tab (logo, cores, tipografia, espaçamento, motivos de marca, iconografia).

**Gerados automaticamente (não editar):** `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`.

---

## Caveats
- **Sem logo oficial:** os SVGs em `assets/` são recriações fiéis à descrição do PDF (gota d'água + wordmark lowercase bold + pill azul). Substitua pelos vetores oficiais quando disponíveis.
- **Sem fotografia de produto:** as imagens de produto são placeholders (ícone + label). Precisamos de **PNGs com fundo removido** das bombonas de 25L.
- **Fontes via Google Fonts CDN** (Plus Jakarta Sans + Inter), não auto-hospedadas — o PDF recomenda explicitamente essas famílias, mas se houver fonte de marca licenciada, troque em `tokens/fonts.css`.
- **Ícones Lucide** são substituição (ver ICONOGRAPHY).
