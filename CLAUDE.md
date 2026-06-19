# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nerta Brasil — Belgian premium automotive chemistry brand, distributed by Provisão. The stack is Next.js (inferred from `.gitignore`).

## Branching Strategy (Gitflow)

Use `/gitflow` for guided branch management. The flow is:

```
main          ← production (only release/* and hotfix/*)
  └── develop ← integration (feature/*, fix/*, chore/*, docs/*, refactor/*, test/*)
        └── release/x.y.z ← staging → merges into main
```

**Branch naming:** `prefix/short-description-in-kebab-case`

| Prefix | Target |
|--------|--------|
| `feature/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/` | `develop` |
| `release/` | `main` |
| `hotfix/` | `main` |

CI validates both the branch name pattern and PR target — violations fail the workflow.

## Pull Requests

Use the PR template (`.github/pull_request_template.md`). Key rules enforced by CI:
- `feature/*`, `fix/*`, `chore/*`, `docs/*`, `refactor/*`, `test/*` → `develop`
- `release/*`, `hotfix/*` → `main`
- `develop` → `release/*` (to open a release candidate)

## Design System

O design system da Nerta Brasil está em `.claude/skills/nerta-design/`. Para qualquer trabalho de UI, leia o `SKILL.md` dessa pasta primeiro.

## Arquitetura de Código

As convenções de arquitetura (camadas `app/`, `features/`, `shared/`, `infrastructure/`, separação `queries.ts`/`actions.ts`, dono único de tipos, auth em duas camadas) estão em `.claude/skills/Nerta Brasil Code Architecture/SKILL.md`. Leia antes de criar qualquer arquivo novo em `src/`.

## Convenção de Idioma no Código (P0 — não-negociável)

- **Código sempre em inglês**: nomes de pastas, arquivos, funções, variáveis, tipos, componentes e propriedades dentro de `src/` são em inglês com nomenclatura clean code (ex: `features/products`, `getProducts()`, `ProductsPage`, `ProductFilters`). Nunca crie uma pasta/arquivo/identificador em português.
- **Exceção deliberada — URL segments**: os segmentos de rota visíveis ao usuário final (ex: `/produtos`, `/produtos/[slug]`) permanecem em português, pois o site atende o público brasileiro e essas URLs carregam valor de SEO. Ou seja, a pasta de rota pode se chamar `app/(public)/produtos/page.tsx` (segmento de URL em PT-BR; `(public)` não aparece na URL) enquanto a função do componente é `ProductsPage` e ela importa de `@/features/products` (código em inglês).
- Strings visíveis ao usuário (UI, textos, mensagens de erro) e descrições de teste (`describe`/`it`) continuam em português — a convenção de idioma é sobre estrutura/identificadores de código, não sobre conteúdo voltado ao usuário ou comentários de teste.
- Ao encontrar código/pastas existentes em português (fora de URL segments), corrija para inglês como parte do trabalho em andamento.

## Migrations

- Schema do banco é Postgres via Supabase. Toda alteração de schema é primeiro escrita como par `db/migrations/NNNN_descricao.up.sql` / `.down.sql` (numeração sequencial com zero-padding), validada localmente, e registrada em `db/controle/MIGRATIONS.md`. Em seguida, o mesmo DDL é replicado para uma migration da Supabase CLI (`supabase migration new` → `supabase/migrations/`), que é o que de fato é aplicado via `supabase db reset`/`supabase db push`.
- Processo completo, regras de DDL e passo a passo: `db/controle/PROCEDURE.md`.
- Dados de exemplo (DML) ficam em `supabase/seed.sql`, nunca em uma migration.

## Estrutura de Rotas — Route Groups (`app/(grupo)/`)

Route groups com parênteses são o padrão recomendado pelo Next.js para compartilhar layout entre rotas-irmãs sem afetar a URL, e é isso que usamos aqui — com uma única regra para evitar colisão de URL:

- **Um route group só pode ser usado quando o segmento de URL real já está garantido por outro meio** (pasta literal ou pelo próprio agrupamento não introduzir ambiguidade). Nunca crie dois route groups de nível equivalente que produzam o mesmo path resolvido.
- **Vitrine pública**: `app/(public)/produtos/page.tsx`, `app/(public)/produtos/[slug]/page.tsx`, `app/(public)/sobre/page.tsx` etc. — o group `(public)` não aparece na URL (`/produtos`, `/produtos/[slug]`, `/sobre`); existe só para dar a essas páginas um `layout.tsx` próprio (header/footer da vitrine), distinto do admin.
- **Admin**: a pasta `app/admin/` é **literal** (sem parênteses) — é ela que produz o prefixo `/admin/*` que o `middleware.ts` protege. Dentro dela, `app/admin/login/page.tsx` fica fora de qualquer group (página pública dentro do admin, sem guard). As demais páginas autenticadas vivem em um group aninhado, `app/admin/(protected)/`, que carrega o `layout.tsx` com o guard de papel (defesa em profundidade) e o Sidebar — esse group aninhado não colide com nada porque já está dentro do prefixo literal `/admin/`.
- **Por que isso não colide com a vitrine**: a regra problemática seria um group de **topo** tipo `(admin)/produtos` (resolveria para `/produtos`, colidindo com a vitrine). Um group **aninhado** dentro de uma pasta literal (`admin/(protected)/...`) não tem esse risco, porque o prefixo `/admin/` já está fixado pela pasta literal antes do group entrar em jogo.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/001-vitrine-catalogo/plan.md`.
<!-- SPECKIT END -->
