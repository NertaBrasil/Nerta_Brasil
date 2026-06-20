# Nerta Brasil — Spec de Componentes

Implementação de referência em `../components/`. Estilize via os tokens (`globals.css.txt` / `tailwind.config.js`). Todos vivem sobre navy — **nenhum componente tem fundo claro**.

---

## Button (`core/Button`)
CTA primário da marca. Pílula (radius 999px), display font bold, tracking −0.01em.

| Prop | Valores | Nota |
|---|---|---|
| `variant` | `primary` · `partner` · `secondary` · `ghost` | primary=azul Nerta, partner=dourado Provisão, secondary=outline, ghost=quieto |
| `size` | `sm` (36px) · `md` (44px) · `lg` (52px) | hit target ≥ 44px no mobile |
| `fullWidth` | bool | |
| `disabled` | bool | fundo `#1A2A40`, texto `#5A6B82` |
| `disabledLabel` | string | texto exibido quando desabilitado (ex: "Produto Indisponível") |
| `href` + `external` | string + bool | renderiza como `<a target="_blank" rel="noopener">` — usar no CTA Mercado Livre |
| `leftIcon`/`rightIcon` | node | ícones Lucide |

**Estados:** hover clareia o fundo; press `scale(0.97)`; foco ring azul `0 0 0 3px rgba(91,184,245,.55)`.

```tsx
<Button variant="primary" size="lg" href={mlUrl} external onClick={() => trackPixel('comprar_ml')}>
  Comprar no Mercado Livre
</Button>
// estoque zerado:
<Button variant="primary" disabled disabledLabel="Produto Indisponível" />
```

---

## Badge (`core/Badge`)
Pill em CAIXA ALTA, tracking +0.08em, borda fina. `tone`: `blue` (produto) · `gold` (Provisão) · `teal` (benefício) · `neutral`. `solid` preenche.

---

## Card + AccentBlock (`core/Card`)
- **Card** — superfície navy-mid, borda fina `#1E3A5A`, radius 12px. `accent` (blue/gold/teal) desenha a **barra lateral esquerda** (motivo assinatura, 3–4px). `interactive` aplica lift `translateY(-2px)` no hover. `raised` usa navy-light.
- **AccentBlock** — bloco de destaque só com a barra lateral + título + texto. azul=performance, teal=tecnologia, dourado=Provisão.

---

## ProductCard (`product/ProductCard`)
Card de catálogo. Anatomia: imagem flutuante (fundo radial navy, **sem sombra**) → label da linha (sky blue, uppercase) → nome (branco bold) → categoria (dourado) → badges (diluição sólida + atributos teal) → descrição → CTA ML.

| Prop | Nota |
|---|---|
| `lineLabel`, `name`, `category`, `dilution`, `attributes[]`, `description`, `imageSrc` | conteúdo |
| `mlUrl` | link Mercado Livre |
| `stock` | `0` → CTA vira "Produto Indisponível" (sem link) |
| `featured` | mostra selo dourado "Destaque" |
| `onBuy` | callback p/ disparar GA/Pixel |

---

## KpiStat (`product/KpiStat`)
Número de impacto 48px bold. `tone`: teal · blue · gold. `align`: left · center. Legenda curta abaixo.

---

## Input + Select (`forms/`)
Campos escuros para `/admin`. Fundo navy-sunken, borda fina, **foco azul com ring**. `Input`: label, hint, error, leftIcon. `Select`: options (string | {value,label}), placeholder. Altura 44px.

---

# Padrões do painel admin (novos)

## Button — variante `danger` (adicionada)
Ações destrutivas usam **vermelho `#D64C39`** (hover `#E0573F`), nunca o azul da marca. Há também `danger-ghost` (outline vermelho) para remoções mais leves. Demais variantes inalteradas.

## Switch (`core/Switch`)
Toggle de boolean (ativo/destaque). Trilho navy, preenche azul Nerta quando ligado. `checked`, `onChange(next)`, `size` (sm|md), `label`, `disabled`. **Suporte a teclado:** `tabIndex={0}`, Enter/Espaço alternam o estado. Acessibilidade: `role="switch"` + `aria-checked`.

## Modal (`core/Modal`)
Diálogo centralizado sobre scrim escuro (`var(--scrim)` + blur). `open`, `title`, `onClose`, `onConfirm`, `confirmLabel`, `cancelLabel`, `destructive` (botão vermelho), `hideFooter` (corpo custom — usado para forms de categoria/usuário e para o cropper). Clique no scrim fecha. **Focus trap:** ao abrir, foco vai para o 1º elemento focável; Tab/Shift+Tab circulam só dentro do modal. **ESC fecha** (dispara `onClose`). `role="dialog"` + `aria-modal="true"`.

## Sidebar shell (`ui_kits/admin/AdminShell`)
Casca compartilhada de todas as rotas admin. Sidebar fixa no desktop (item ativo com barra lateral azul + fundo `blue-soft`), **drawer com hambúrguer no mobile** (`<900px`). Top bar sticky com título, nome do usuário, **RoleBadge** e botão Sair. Itens: Produtos, Categorias, Destaques, Usuários — para `editor`, Usuários aparece **visível com ícone de cadeado** (`<span>` não clicável, `cursor: not-allowed`) em vez de oculto; o bloqueio real é feito no middleware Next.js (prop `userRole`).

## Helpers de tabela (`AdminShell` + `widgets`)
- **RoleBadge** — admin=dourado, editor=sky blue.
- **StatusPill** — ativo (teal, dot) / inativo (muted).
- **IconBtn** — botão de ação só-ícone para linhas; `tone` default|blue|danger, `disabled` (ex: excluir a própria conta).
- **SearchBar** — input com ícone de busca (filtro em tempo real).
- **FilterSelect** — dropdown pill compacto para filtros de tabela ("Categoria: todos").
- Tabelas alternam cor de linha (navy-light / navy-mid), header em `surface-raised`.

## TagInput (`widgets`)
Campo de atributos/badges: digite + **Enter** adiciona pill (teal, removível com ×); Backspace remove a última. `tags[]`, `onChange(next[])`, `placeholder`.

## ImageCropper (`widgets`)
Interface de **recorte 1:1**: moldura quadrada com overlay azul, arraste para posicionar, slider de zoom, Confirmar/Cancelar. Renderizado dentro de um `Modal hideFooter`. Após confirmar, a imagem entra na galeria.

## Galeria de imagens (form de produto)
Grid de imagens **reordenável por drag-and-drop**; a primeira recebe o selo azul **"Principal"** (capa do card); cada uma tem botão de excluir; tile "Adicionar" abre o cropper. Sem limite de imagens.

## Spinner
Indicador de carregamento inline, não bloqueia layout. `size` (px, padrão 20), `color` (padrão `var(--sky-blue)`). Animação `nerta-spin` injetada uma vez no `<head>` via JS, sem dependência externa.

```tsx
{loading && <Spinner size={24} />}
```

## NetworkError
Banner de erro de rede, dismissable. `message` (string | null — falsy não renderiza nada), `onDismiss` (opcional, exibe botão ×). Fundo `rgba(229,99,77,0.1)`, borda `rgba(229,99,77,0.4)`, ícone `alert-circle` (Lucide).

```tsx
<NetworkError message={error} onDismiss={() => setError(null)} />
```

## LoadingSkeleton
Esqueleto animado para estado de carregamento inicial (keyframe `skeleton-pulse`). `rows` (padrão 5), `type`: `'table'` (linhas com thumb + ações) | `'cards'` (grid estilo Destaques).

```tsx
{loading ? <LoadingSkeleton rows={6} type="table" /> : <TabelaProdutos />}
```
