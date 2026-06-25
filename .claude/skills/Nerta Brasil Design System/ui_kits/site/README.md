# UI Kit — Vitrine (Storefront)

Recreação interativa da vitrine pública Nerta Brasil. **Sem login, sem carrinho, sem checkout próprio** — o MVP é `landing → catálogo → produto → redirect Mercado Livre`.

## Telas
- **LandingPage.jsx** — hero com gradiente navy, números de impacto (KPIs), carrossel de produtos em destaque (`featured`), banda de tecnologia com blocos de barra lateral.
- **CatalogPage.jsx** — filtros por linha (chips) + grid responsivo (`auto-fill minmax(280px)`), apenas produtos `active`.
- **ProductPage.jsx** — imagem flutuante, destaque de diluição, **tabela de diluição obrigatória**, âncora de custo/lavagem, CTA "Comprar no Mercado Livre" (`target="_blank"`), e estado **"Produto Indisponível"** quando `stock === 0`.
- **AboutPage.jsx** — "Sobre Nós": história belga, pilares (numeração editorial), KPIs, e `ImageSlot`s reservados para a fotografia da Nerta.
- **Header.jsx / Footer.jsx** — chrome compartilhado. Footer com logo Nerta.

## Como abrir
`index.html` carrega React + Babel + o bundle do design system (`../../_ds_bundle.js`), depois `data.js` e as telas. Navegação por estado em `App` (sem rotas reais).

## Regras de negócio embutidas
- Botão ML abre em nova aba e tem `onBuy` para disparar GA/Pixel.
- `stock === 0` desabilita o CTA, sem redirect.
- `featured` → carrossel da home. `active` → visível no catálogo.

## ⚠️ Placeholders
As imagens de produto são placeholders (ícone + label). Substitua por **fotos PNG com fundo removido** (float sobre navy, sem sombra) — ver `data.js` e o prop `imageSrc` de `ProductCard`.
