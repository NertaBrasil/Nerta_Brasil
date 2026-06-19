# Implementation Plan: Catálogo Público de Produtos

**Branch**: `002-catalogo-publico` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-catalogo-publico/spec.md`

## Summary

Página pública de listagem de produtos ativos, com filtro por categoria, sem busca textual nem paginação. Reaproveita integralmente a stack, o modelo de dados (`products`, `categories`) e os contratos de leitura (`getProducts`, `getCategories`) já definidos em [specs/001-vitrine-catalogo/plan.md](../001-vitrine-catalogo/plan.md). Esta feature não introduz nenhuma entidade, contrato ou decisão técnica nova — por isso não há `research.md`, `data-model.md`, `contracts/` ou `quickstart.md` próprios; as seções §2.2 e §5 de [001/quickstart.md](../001-vitrine-catalogo/quickstart.md) já cobrem a validação manual deste fluxo.

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router), Tailwind CSS, React 18+

**Storage**: PostgreSQL (Supabase) — leitura das tabelas `products` e `categories`, já definidas em `001-vitrine-catalogo/data-model.md`. Nenhuma escrita ocorre nesta feature.

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `getProducts(filters?)` em `features/products/queries.ts` (filtro por categoria, exclusão de inativos, inclusão de estoque zero); React Testing Library cobre `ProductCard` (indicador de indisponibilidade quando `stock === 0`) e `ProductFilters` (seleção de categoria).

**Target Platform**: Web, rota `/produtos`, pública (sem autenticação), Server Component.

**Project Type**: Web application — módulo da vitrine pública, dentro da estrutura já definida em 001.

**Performance Goals**: Listagem completa visível em até 2s (SC-001) — atendido por renderização server-side sem chamadas client-side adicionais antes do primeiro paint.

**Constraints**:
- Produtos com `active = false` nunca retornam da query, em nenhum estado de filtro (FR-001, SC-002).
- Sem paginação nem busca textual nesta versão (volume estimado ~100 produtos).
- Filtro de categoria é client-side interativo (`"use client"`), mas a listagem inicial é renderizada no servidor.

**Scale/Scope**: ~100 produtos ativos, filtro de categoria única.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Catálogo é puro browsing — sem carrinho, checkout ou login. Cada card linka para a página de produto (fora de escopo aqui). | ✅ PASS |
| II. Server Component | Listagem é RSC; `ProductFilters` é Client (interatividade do filtro). | ✅ PASS |
| III. Design System | `ProductCard` usa tokens/componentes do design system para o indicador de indisponibilidade (badge), sem hex/px avulso. | ✅ PASS |
| IV. Segurança | Sem dados privados expostos — query pública já filtra `active = true` no servidor. | ✅ PASS |
| V. Simplicidade | Sem paginação/busca além do que o spec exige. Reaproveita `getProducts`/`getCategories` de 001 sem reescrever. | ✅ PASS |
| VI. TDD Obrigatório | Testes de `getProducts` (filtro + exclusão de inativos) e de `ProductCard` (indicador de indisponibilidade) escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/002-catalogo-publico/
├── plan.md   # Este arquivo — não há research.md/data-model.md/contracts/quickstart.md
│             # próprios; consulte os equivalentes em specs/001-vitrine-catalogo/
└── tasks.md  # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/(public)/produtos/
│   └── page.tsx                  # RSC — compõe ProductGrid + ProductFilters via barrel de features/products
└── features/products/
    ├── components/
    │   ├── ProductGrid.tsx        # RSC — renderiza a lista de ProductCard
    │   ├── ProductCard.tsx        # RSC — card individual (decide indicador de indisponibilidade)
    │   └── ProductFilters.tsx     # Client — seleção de categoria, atualiza query params
    ├── queries.ts                  # getProducts(filters?), getCategories() — já contratados em 001
    └── index.ts                     # Barrel já previsto em 001
```

**Structure Decision**: Nenhuma pasta nova — reaproveita `features/products/` já planejado em 001. `app/(public)/produtos/page.tsx` apenas lê `searchParams.category` e repassa para `getProducts({ category_slug })`, mantendo a página como composição pura.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
