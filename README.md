# Nerta Brasil

Site institucional e vitrine de produtos da **Nerta Brasil** — marca belga líder global em limpeza química para Car & Truckwash, distribuída com exclusividade no Brasil pela **Provisão Comércio Internacional**.

> *"Tecnologia química europeia de alta performance para um mercado que ainda utiliza soluções inferiores."*

---

## Sobre o projeto

Plataforma **vitrine + SEO** que apresenta o catálogo de detergentes concentrados da Nerta para os segmentos **Frotas**, **Agro**, **Detailing** e **Animal**. O posicionamento é de química de laboratório premium — credibilidade técnica antes de catálogo.

O **checkout é 100% no Mercado Livre**: o site não possui carrinho nem checkout próprio. Cada produto leva o usuário ao anúncio correspondente no Mercado Livre.

- **Quem:** Nerta (Bélgica) × Provisão (distribuidor exclusivo Brasil)
- **Lançamento nacional:** 2026
- **Produtos:** detergentes concentrados em bombonas de 25L (diluição 3–20%)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| Linguagem | TypeScript (strict mode) |
| Estilo | Tailwind CSS v4 (config CSS-first via `@theme`, sem `tailwind.config.ts`) |
| Backend | Supabase (Postgres + Auth + Storage) |
| Validação | Zod |
| Testes | Vitest + React Testing Library + `@testing-library/user-event` |
| Lint | oxlint |
| Checkout | Mercado Livre (externo — sem carrinho/checkout próprio) |

---

## Como rodar localmente

**Pré-requisitos**: Node.js 20+ e um projeto Supabase (local via Supabase CLI ou remoto).

```bash
npm install                  # instala dependências
cp .env.example .env.local   # preencha com as credenciais do seu projeto Supabase
npm run dev                  # http://localhost:3000
```

Outros comandos disponíveis:

```bash
npm run build       # build de produção (next build)
npm run start       # serve o build de produção
npm run lint         # oxlint — enforcement do design system e das regras de import entre camadas
npm test             # vitest run — suíte completa, single run
npm run test:watch   # vitest em modo watch
```

> Sem um `.env.local` válido, páginas que leem do Supabase (ex.: `/produtos`) retornam erro 500 em tempo de execução — o build e o lint funcionam normalmente sem banco configurado.

---

## Variáveis de ambiente

Definidas em `.env.example` (nunca commitar `.env`/`.env.local`):

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase — exposta ao browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (RLS aplica as restrições) — exposta ao browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave com privilégios totais — **nunca** usada fora de `infrastructure/supabase/admin.ts`, exclusiva de Server Actions em `features/admin/**` |

---

## Estrutura de pastas e arquitetura

```text
src/
├── app/             # Roteamento Next.js (App Router). Só orquestra — quase zero lógica.
│   └── (public)/      # Route group da vitrine pública (segmentos de URL ficam em PT-BR: /produtos)
├── features/        # Domínio de negócio — onde tudo nasce.
│   └── products/      # Ex.: queries.ts, types.ts, components/, index.ts (barrel)
├── shared/           # Reuso entre 2+ features (components/ui, utils, types). Nasce vazio, cresce por promoção.
└── infrastructure/   # Integrações externas (Supabase). Não conhece domínio de negócio.
```

Convenções principais (detalhadas em `.claude/skills/Nerta Brasil Code Architecture/SKILL.md`):

- **Código sempre em inglês** (pastas, arquivos, funções, variáveis, tipos, componentes) — única exceção são os *segmentos de URL* (`/produtos`, `/produtos/[slug]`), que permanecem em português por SEO, já que o site atende o público brasileiro.
- `queries.ts` (leitura, sem `"use server"`) é sempre separado de `actions.ts` (mutação, `"use server"` + checagem de papel).
- Cada entidade de domínio (`Product`, `Category`, ...) tem um único dono em `types.ts` — outras features importam com `import type`.
- Cada feature expõe sua API pública por um único `index.ts` (barrel); nunca importe um caminho profundo de outra feature.
- TDD é obrigatório (Princípio VI da constituição em `.specify/memory/constitution.md`): testes escritos e vermelhos antes da implementação correspondente.

O design system (paleta, tipografia, tokens Tailwind) está documentado em `.claude/skills/Nerta Brasil Design System/`.

---

## Status de implementação

Specs e progresso são geridos via spec-kit em `specs/<NNN>-nome/` (cada uma com `spec.md`, `plan.md`, `tasks.md`).

| Spec | Descrição | Status |
|---|---|---|
| 001-vitrine-catalogo | Arquitetura geral (referência, não implementação) | — |
| 002-catalogo-publico | Catálogo público (`/produtos`), filtro por categoria, link para detalhe | ✅ Implementada |
| 003-pagina-produto | Página de detalhe do produto + botão de compra no Mercado Livre | ⏳ Planejada |
| 004-home-landing | Home institucional + produtos em destaque | ⏳ Planejada |
| 005-admin-autenticacao | Autenticação do painel admin | ⏳ Planejada |
| 006-admin-categorias | CRUD de categorias (admin) | ⏳ Planejada |
| 007-admin-produtos-crud | CRUD de produtos (admin) | ⏳ Planejada |
| 008-admin-produtos-imagens | Upload/gestão de imagens de produto (admin) | ⏳ Planejada |
| 009-admin-destaques | Gestão de produtos em destaque (admin) | ⏳ Planejada |
| 010-admin-usuarios | Gestão de usuários administrativos | ⏳ Planejada |

Cada spec é implementada em sua própria branch (`feature/<NNN>-nome`) com PR próprio para `develop`.

---

## Regras de negócio (MVP)

- Usuário final **não faz login** — apenas a rota `/admin` é protegida (Supabase Auth).
- Botão **"Comprar no Mercado Livre"** abre em nova aba e dispara eventos de GA/Pixel.
- Produto com `stock === 0` → botão desabilitado **"Produto Indisponível"** (sem redirect).
- Flag `featured` → carrossel da home. Flag `active` → visível no catálogo.
- **Sem carrinho. Sem checkout próprio.**

---

## Identidade visual

O projeto segue o **Nerta Brasil Design System**. Princípios não-negociáveis:

- Fundo **navy `#0D1B2E`** em toda a interface (nunca claro).
- **Azul `#1E7FC8`** para CTAs e links.
- **Dourado `#C9951A`** exclusivo da parceria com a Provisão.
- **Teal `#1DB87E`** apenas para ícones de benefício.
- Tipografia: **Plus Jakarta Sans** (títulos) + **Inter** (corpo).
- Tom técnico e premium, sempre com dado (diluição, custo/lavagem, certificações). Sem emoji.

A fonte canônica da marca é o guia de identidade visual `Nerta_Identidade_Visual_2026.pdf`.

---

## Fluxo de contribuição

O repositório segue o modelo **Gitflow**. Antes de contribuir, leia o [CONTRIBUTING.md](./CONTRIBUTING.md).

```
feature/* ─┐
fix/*      ├──► develop ──► release/* ──► main
chore/*    ┘
hotfix/* ──────────────────────────────► main (emergência)
```

- Nenhum push direto em `main` ou `develop` — tudo via Pull Request.
- Branches seguem a convenção `tipo/descricao-curta` (ex.: `feature/catalogo-filtros`).

---

## Licença

Projeto proprietário — Provisão Comércio Internacional. Todos os direitos reservados.
