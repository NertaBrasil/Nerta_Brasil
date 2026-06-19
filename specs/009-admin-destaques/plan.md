# Implementation Plan: Gestão de Produtos em Destaque no Painel Administrativo

**Branch**: `009-admin-destaques` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/009-admin-destaques/spec.md`

## Summary

Marcação/desmarcação de produtos como destaque e reordenação por drag-and-drop da grade de destaques, restritas a usuários autenticados (`admin`/`editor`), controlando a ordem de exibição na seção de destaques da home pública (spec 004, consumidora). Diferente das specs 002/003/006/007/008, esta feature **não** é um plano fino: 001-vitrine-catalogo definiu `products.featured` como booleano simples, sem nenhuma noção de ordem persistida — gap já identificado em [004-home-landing/research.md](../004-home-landing/research.md). Esta spec resolve esse gap adicionando a coluna `featured_position` a `products` e um novo contrato `reorderFeatured`, documentados em `research.md`, `data-model.md` e `contracts/server-actions.md`.

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Tailwind CSS, biblioteca de drag-and-drop (mesma já assumida para `reorderProductImages` em 008, se aplicável — detalhe de implementação)

**Storage**: PostgreSQL (Supabase) — `products.featured` (já existente) + `products.featured_position` (nova coluna, ver `data-model.md`). Sem tabela nova.

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `toggleFeatured` (atribuição de `featured_position` ao marcar, `NULL` ao desmarcar, idempotência), `reorderFeatured` (rejeição quando a lista não corresponde ao conjunto atual de destacados, atualização atômica) e `getFeaturedProducts` (ordenação por `featured_position ASC`); React Testing Library cobre a grade de destaques (estado vazio quando nenhum produto está marcado — FR-008) e o toggle de destaque (1 interação — SC-001).

**Target Platform**: Web, rota `/admin/destaques`, protegida por `middleware.ts` (spec 005-admin-autenticacao, pré-requisito); depende de produtos já existirem (spec 007-admin-produtos-crud, pré-requisito); consumida pela home pública (spec 004-home-landing).

**Project Type**: Web application — tela do painel administrativo, dentro da estrutura já definida em 001, com uma extensão de schema própria.

**Performance Goals**: Toggle de destaque em 1 interação (SC-001); reordenação refletida na home pública sem etapa de publicação adicional (SC-003).

**Constraints**:
- Produto inativo MUST poder ser marcado como destaque (a marcação é independente de `active`); a home pública MUST exigir `active = true AND featured = true` simultaneamente (FR-001, FR-005, SC-002, Edge Case).
- Exclusão permanente de um produto MUST removê-lo da grade de destaques sem deixar referência quebrada — satisfeito automaticamente por `featured_position` ser coluna de `products`, não de tabela separada (FR-006, SC-004, ver `research.md` §3).
- Reordenação MUST persistir a nova ordem atomicamente para todos os produtos destacados, no mesmo padrão de `reorderProductImages` (FR-004).
- Sem limite explícito de produtos em destaque nesta versão (Assumptions).

**Scale/Scope**: Subconjunto pequeno de produtos (tipicamente poucos, curados manualmente) dentro do universo de ~100 produtos ativos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Gestão de destaques é exclusivamente administrativa; a home pública apenas consome `getFeaturedProducts()` já existente. | ✅ PASS |
| II. Server Component | Tela de destaques (`page.tsx`) é RSC; `FeaturedGrid` (drag-and-drop) é Client. | ✅ PASS |
| III. Design System | Grade usa `ProductCard`/tokens existentes; estado vazio segue padrão visual do design system. | ✅ PASS |
| IV. Segurança | `toggleFeatured`/`reorderFeatured` usam `service_role` apenas dentro de Server Actions; acesso restrito a sessão válida com papel `admin`/`editor`. | ✅ PASS |
| V. Simplicidade | Coluna escalar (`featured_position`) em vez de tabela de junção, por ser relação 1:1 por produto (ver `research.md` §1). | ✅ PASS |
| VI. TDD Obrigatório | Testes de atribuição/limpeza de posição, atomicidade da reordenação e ordenação da query escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — alteração de schema é mínima (uma coluna nullable + índice único parcial) e justificada por gap real identificado em spec anterior; nenhuma violação de princípio.**

## Project Structure

### Documentation (this feature)

```text
specs/009-admin-destaques/
├── plan.md              # Este arquivo
├── research.md           # Decisão sobre featured_position vs. tabela própria; revisão de toggleFeatured
├── data-model.md          # Delta: nova coluna products.featured_position
├── contracts/
│   └── server-actions.md   # toggleFeatured revisado + reorderFeatured (único contrato novo)
└── tasks.md                  # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/(admin)/destaques/
│   └── page.tsx                          # RSC — compõe FeaturedGrid
└── features/admin/featured/
    ├── components/
    │   └── FeaturedGrid.tsx                # Client — drag-and-drop, toggle, estado vazio
    ├── actions.ts                            # toggleFeatured (revisado), reorderFeatured (novo)
    ├── types.ts                                # ReorderFeaturedInput (novo)
    └── index.ts                                  # Barrel já previsto em 001
```

**Structure Decision**: Nenhuma pasta nova fora do já previsto em `features/admin/featured/` (001, linha ~121). `reorderFeatured` e `ReorderFeaturedInput` são adicionados a `actions.ts`/`types.ts` dessa mesma feature, ao lado de `toggleFeatured`. A migração de schema (`featured_position`) acompanha esta feature na fase de implementação, não em 001 ou 007.

## Complexity Tracking

| Violação | Por que é necessária | Alternativa mais simples rejeitada |
|----------|----------------------|-------------------------------------|
| Alteração de schema fora de 001 (nova coluna `featured_position`) | 001 não modelou ordem para destaques; a reordenação por drag-and-drop (FR-004) é requisito explícito desta spec, não opcional | Tabela de junção própria (`featured_products`) — rejeitada por modelar uma relação 1:1 como se fosse N:M, adicionando JOIN e entidade sem necessidade (Princípio V) |
