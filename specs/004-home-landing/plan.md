# Implementation Plan: Home / Landing Institucional

**Branch**: `004-home-landing` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-home-landing/spec.md`

## Summary

Landing institucional com seção de produtos em destaque (`active = true AND featured = true`) e CTA para o catálogo completo. Reaproveita a stack e o contrato `getFeaturedProducts()` já definidos em [specs/001-vitrine-catalogo/plan.md](../001-vitrine-catalogo/plan.md). Não introduz nenhuma entidade nova — não há `data-model.md`/`contracts/` próprios; consulte os equivalentes em 001. Há uma única decisão específica desta feature, registrada em `research.md`: a ordem de exibição dos destaques na home é a mesma definida pela curadoria administrativa (spec 009-admin-destaques), não uma ordenação própria desta página.

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router), Tailwind CSS, React 18+

**Storage**: PostgreSQL (Supabase) — leitura de `products` via `getFeaturedProducts()`, já definida em `001-vitrine-catalogo/contracts/server-actions.md`. Nenhuma escrita; conteúdo institucional é estático/editorial (não vem do banco, por Assumptions do spec).

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `getFeaturedProducts()` (filtro duplo `active = true AND featured = true`, exclusão de inativos mesmo que marcados como destaque); React Testing Library cobre a seção de destaques decidindo entre estado neutro (sem produtos) e grid renderizado.

**Target Platform**: Web, rota `/` (home), pública, Server Component.

**Project Type**: Web application — módulo da vitrine pública, dentro da estrutura já definida em 001.

**Performance Goals**: Seção institucional visível em até 2s (SC-001); chegada ao catálogo em 1 clique (SC-002).

**Constraints**:
- Produtos em destaque exibidos MUST satisfazer `active = true AND featured = true` simultaneamente — um produto `featured = true` mas `active = false` nunca aparece (FR-003, SC-003).
- Ausência de produtos em destaque MUST resultar em estado neutro (seção omitida), nunca em erro (FR-005, SC-004).
- Nenhum elemento de carrinho, checkout ou login de usuário final (FR-007) — reforça o Princípio I da constituição.

**Scale/Scope**: Sem limite mínimo de itens em destaque; limite máximo (se houver) é decisão de apresentação, sem impacto de negócio (Assumptions do spec).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Home é puro institucional + CTA; sem carrinho/checkout/login (FR-007). | ✅ PASS |
| II. Server Component | Página inteira é RSC — nenhuma interação de browser exigida nesta feature. | ✅ PASS |
| III. Design System | Seção institucional e cards de destaque usam tokens/componentes existentes (mesmo `ProductCard` do catálogo). | ✅ PASS |
| IV. Segurança | Sem dado privado exposto; query já filtra `active`/`featured` no servidor. | ✅ PASS |
| V. Simplicidade | Sem painel de edição de conteúdo institucional nesta versão (Assumptions). Reaproveita `getFeaturedProducts`/`ProductCard` sem reescrever. | ✅ PASS |
| VI. TDD Obrigatório | Teste do filtro duplo de `getFeaturedProducts` e do estado neutro escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/004-home-landing/
├── plan.md       # Este arquivo
├── research.md    # Decisão sobre ordem dos destaques (consome spec 009, não define ordenação própria)
└── tasks.md         # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/(site)/
│   └── page.tsx                   # RSC — compõe InstitutionalSection + FeaturedSection
└── features/produtos/
    ├── components/
    │   ├── ProductCard.tsx          # Reaproveitado do catálogo (002) sem alteração
    │   └── FeaturedSection.tsx       # RSC — grid de destaques ou estado neutro
    ├── queries.ts                      # getFeaturedProducts() — já contratada em 001
    └── index.ts                         # Barrel já previsto em 001
```

**Structure Decision**: Nenhuma pasta nova — reaproveita `features/produtos/`. `InstitutionalSection` (conteúdo estático) vive como componente local de `app/(site)/page.tsx`, já que não tem lógica de domínio nem é reaproveitado por outra página.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
