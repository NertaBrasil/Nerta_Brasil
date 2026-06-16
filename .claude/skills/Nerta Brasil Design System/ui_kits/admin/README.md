# UI Kit — Admin

Tela de **login** do painel administrativo (`/admin`). Única área protegida do produto — autenticação via **Supabase Auth**. Usuário final nunca faz login.

`index.html` compõe `Input` + `Button` do design system sobre um split-screen: lado de marca com gradiente navy + textura de espuma sutil, lado de formulário em navy-sunken.

## Painel administrativo completo
Telas-fonte (cada uma vira um standalone em `handoff/`):
- `produtos.html` — listagem (busca, filtros, ações inline, modal de exclusão).
- `produtos-form.html` — form de criar/editar (slug auto, tag input, toggles, recorte 1:1, galeria reordenável).
- `categorias.html` — CRUD de categorias (bloqueio quando há produtos vinculados).
- `destaques.html` — toggle de destaque por produto + contador do carrossel.
- `usuarios.html` — gestão de usuários (admin only; editor não vê).

Compartilham `AdminShell.jsx` (sidebar + topbar responsivos, ciente de papel), `widgets.jsx` (TagInput, FilterSelect, ImageCropper, Switch/Modal kit-local), `admin-data.js` (dados de exemplo) e `assets-inline.js` (logos embutidos).

Próximas telas naturais (não incluídas): listagem de produtos, editor de produto (estoque, `featured`, `active`), upload de imagem (Supabase Storage).
