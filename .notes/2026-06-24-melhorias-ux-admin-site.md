# Plano — Melhorias de UX/UI (admin + site público)

Registrado em 2026-06-24. Mapeado a partir de feedback direto do usuário (capturas de tela) + auditoria de código. Cada bloco é uma branch/PR própria, seguindo o Gitflow do projeto (`feature/*`, `fix/*`, `chore/*` → `develop`).

## Ordem de execução

0 → A → B → C → D → E

## Bloco 0 — Seed de produtos fictícios ricos + imagens (`chore/seed-demo-products`)

- Popular o catálogo com produtos fictícios variados: nomes, linhas comerciais, categorias, descrições curtas/completas, atributos, diluição, estoque, modo de compra (mercado_livre / formulario_parceria) variados.
- Adicionar imagens fictícias (placeholder) para visualizar a galeria preenchida de forma realista.
- Via `supabase/seed.sql` (dados de exemplo, nunca em migration) ou diretamente pelo admin.
- Objetivo: dar base visual real para validar os blocos seguintes.

## Bloco A — Admin: layout e consistência (`fix/admin-layout-consistency`)

1. Formulários (Produto, Categoria, Usuário) ocupando a largura total disponível, respeitando a margem do layout — hoje ficam curtos e desproporcionais à tabela abaixo.
2. Sidebar do admin: colapsar corretamente no mobile (menu hambúrguer) — hoje o conteúdo fica espremido ao lado do sidebar fixo em telas pequenas.
3. Sidebar do admin: bloco "Dev Admin / Sair" fixo na sidebar no desktop — hoje "flutua" na altura onde o conteúdo da página termina, em vez de ficar ancorado.
4. Campo "Slug" no form de produto com texto de apoio explicando o que é (URL do produto, gerada do nome).
5. Breadcrumb / link "voltar para lista" nas páginas de detalhe do admin (editar produto, editar parceria etc.) — hoje só dá pra voltar pelo botão do navegador ou pela sidebar.
6. Empty states do admin com algo além de um `<p>` cinza — incluir CTA pra próxima ação (ex: "Nenhuma categoria cadastrada — Adicionar categoria").

## Bloco B — Imagens: admin e público (`feature/product-images-ux`)

7. Galeria de imagens do admin: clicar para abrir/zoom, escolher qual é a imagem principal (não fixa), exibir dimensões/tamanho do arquivo.
8. Galeria pública da página de produto: redesenhar na pegada marketplace (imagem grande, thumbnails de navegação, setas pra avançar/voltar) mantendo a identidade visual da Nerta — e marcar visualmente qual é a imagem principal (hoje só o admin marca, o público não reflete isso).
9. Restringir o input de upload a `accept="image/*"` (hoje aceita qualquer tipo de arquivo, só valida depois em JS).

## Bloco C — Paginação e filtros nas listagens do admin (`feature/admin-pagination-filters`)

10. Adicionar paginação (com escolha de itens por página) e filtros nas listagens do admin: produtos (categoria, status, linha), categorias, usuários, parcerias. Hoje todas buscam a tabela inteira sem corte (`select` sem `.range()`/`.limit()`).

## Bloco D — Copy do CTA "Formulário de Parceria" (`fix/partner-cta-copy`)

11. O botão/formulário "Quero ser parceiro Nerta Brasil" hoje sugere só cadastro de distribuidor/B2B, mas pessoa física que só quer comprar também passa por ali. Mantendo o mesmo fluxo/formulário, ajustar o texto (botão e introdução do form) para deixar claro que ali também se manifesta interesse de compra, não só parceria comercial.

## Bloco E — Site público: qualidade e SEO (`feature/public-site-quality-seo`)

12. `loading.tsx` / `error.tsx` / `not-found.tsx` com a identidade visual da Nerta (hoje cai no genérico do Next em todas as páginas).
13. SEO técnico: `metadata`/`generateMetadata` por página (catálogo, produto, sobre), Open Graph por produto, `sitemap.xml`, `robots.txt`, dados estruturados (JSON-LD de produto), URLs canônicas. *Analytics (GA4/Meta Pixel com IDs reais) fica para quando o domínio for comprado — o disparo de evento (`trackBuyClick`) já existe no código.*
14. Busca por texto no catálogo público (hoje `ProductFilters` só tem chips de categoria).
15. Menu mobile (hambúrguer) no `Header` público — hoje a nav é flat e não colapsa.
16. Footer institucional: CNPJ, endereço e contato (fictícios por ora, até virarem reais), redes sociais — hoje é só logo + uma frase + copyright. **Sem nenhuma menção à Provisão** — a marca pública é só Nerta.
17. Remover menções à Provisão também na skill de design system (`.claude/skills/Nerta Brasil Design System/` — guidelines, UI kits, handoff) onde ela prescreve uso do logo/cor/atribuição da Provisão.

## Achados de auditoria (contexto, não itens novos de ação isolados)

- Nenhuma página do projeto tem `loading.tsx`/`error.tsx`/`not-found.tsx` customizado (confirmado por busca em `src/app/**`).
- Erros de query sobem sem tratamento amigável (`if (error) throw error;` em `queries.ts`, sem `error.tsx` boundary).
- `DeleteUserModal`/`DeleteCategoryModal`/`DeleteProductModal` já têm confirmação antes de excluir — não é um problema.
- Todas as tags `<img>` já têm `alt` preenchido — não é um problema.
