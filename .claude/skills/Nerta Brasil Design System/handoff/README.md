# Nerta Brasil — Handoff para Desenvolvedor

Pacote de implementação da vitrine Nerta Brasil. **Público-alvo:** desenvolvedor (ou Claude Code) implementando em **Next.js App Router · Supabase · TypeScript · Tailwind CSS**.

## Conteúdo deste pacote
| Arquivo | O que é |
|---|---|
| `Nerta-Vitrine-standalone.html` | Vitrine completa, **responsiva (desktop + mobile)**, autossuficiente. Abra no navegador para ver o comportamento real: landing → catálogo → produto → redirect ML. |
| `Nerta-Admin-standalone.html` | Tela de login `/admin` (Supabase Auth), responsiva. |
| `Nerta-Admin-Produtos.html` | Listagem de produtos: busca, filtros, ações inline, modal de exclusão. |
| `Nerta-Admin-Produtos-Form.html` | Form de produto: slug auto, tag input, toggles, upload com recorte 1:1 + galeria reordenável. |
| `Nerta-Admin-Categorias.html` | Categorias: listagem + criar/editar/excluir (bloqueio com produtos vinculados). |
| `Nerta-Admin-Destaques.html` | Gestão de destaques: toggle por produto + contador do carrossel. |
| `Nerta-Admin-Usuarios.html` | Usuários (admin only): papéis, criar/editar/excluir, sem auto-exclusão. |
| `tailwind.config.js` | Tokens da marca já mapeados para o tema do Tailwind. Copie para o projeto. |
| `globals.css.txt` | CSS custom properties (tokens) + reset para colar em `app/globals.css`. |
| `COMPONENTS.md` | Spec de cada componente: props, variantes, estados. |
| `BUSINESS_RULES.md` | Regras de negócio críticas (ML, estoque, flags, auth). |
| `../readme.md` | Guia de marca completo (conteúdo, fundações visuais, iconografia). |

## Ordem sugerida de implementação
1. **Tokens** — cole `globals.css.txt` em `app/globals.css` e `tailwind.config.js` na raiz. Importe a fonte (Plus Jakarta Sans + Inter) via `next/font` ou `<link>`.
2. **Layout base** — `body` em navy `#0D1B2E`, nunca fundo claro. Header sticky com blur, footer com logo Nerta.
3. **Componentes primitivos** — Button, Badge, Card, AccentBlock, Input, Select (ver `COMPONENTS.md`). Os fontes React de referência estão em `../components/`.
4. **Dados** — modele os produtos no Supabase com os campos de `../ui_kits/site/data.js` (slug, line, name, category, dilution, attributes, description, stock, featured, active, mlUrl).
5. **Páginas** — Landing, Catálogo (`/catalogo`), Produto (`/produto/[slug]`), Sobre (`/sobre`), Admin (`/admin`, `/admin/produtos`, `/admin/produtos/novo`, `/admin/produtos/[id]`, `/admin/categorias`, `/admin/destaques`, `/admin/usuarios`).
6. **Regras de negócio** — aplique `BUSINESS_RULES.md` à risca (eventos GA/Pixel, estoque, flags, proteção do `/admin`).

## Fontes de referência (código real)
Os componentes e telas deste handoff têm implementação React de referência no design system:
- Componentes: `../components/{core,product,forms}/`
- Telas: `../ui_kits/site/*.jsx` e `../ui_kits/admin/index.html`
- Tokens canônicos: `../tokens/*.css`

> Os arquivos `.jsx` são recriações de design (cosméticas, sem lógica de produção). Use-os como **fonte visual de verdade**, não como código final.

## ⚠️ Pendências de asset (ver readme.md › Caveats)
- Logos oficiais (os SVGs em `../assets/` são recriações).
- Fotografia de produto (PNGs com fundo removido das bombonas 25L).
- Fontes licenciadas, se houver (hoje via Google Fonts).
- Set de ícones — hoje Lucide (substituição).
