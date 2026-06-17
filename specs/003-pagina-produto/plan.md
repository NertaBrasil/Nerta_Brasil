# Implementation Plan: Página de Detalhe do Produto

**Branch**: `003-pagina-produto` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-pagina-produto/spec.md`

## Summary

Página individual e indexável por produto (`/produtos/[slug]`), exibindo galeria, ficha técnica e botão de compra com analytics, retornando 404 para slug inválido ou produto inativo. Reaproveita integralmente a stack, o modelo de dados (`products`, `product_images`) e os contratos já definidos em [specs/001-vitrine-catalogo/plan.md](../001-vitrine-catalogo/plan.md) (`getProductBySlug`, `trackBuyClick`). Esta feature não introduz nenhuma entidade ou contrato novo — não há `research.md`, `data-model.md` ou `contracts/` próprios; a validação manual já está coberta pelas seções §2.3 e §2.4 de [001/quickstart.md](../001-vitrine-catalogo/quickstart.md).

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router, `notFound()`), Tailwind CSS, React 18+

**Storage**: PostgreSQL (Supabase) — leitura de `products`/`product_images` via `getProductBySlug(slug)`, já definida em `001-vitrine-catalogo/data-model.md` e `contracts/server-actions.md`. Nenhuma escrita.

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `getProductBySlug` (retorna `null` para slug inexistente OU `active = false`, mapeado para `notFound()` na página) e `trackBuyClick` (parâmetros corretos para GA4/Pixel); React Testing Library cobre o botão de compra decidindo entre habilitado/"Produto Indisponível" (`stock === 0` OU `ml_url` ausente).

**Target Platform**: Web, rota `/produtos/[slug]`, pública (sem autenticação), Server Component com botão de compra como Client Component isolado.

**Project Type**: Web application — módulo da vitrine pública, dentro da estrutura já definida em 001.

**Performance Goals**: Conteúdo principal visível em até 2s (SC-001) — renderização server-side, sem espera por chamadas client-side para o conteúdo textual/galeria.

**Constraints**:
- `getProductBySlug` retornando `null` (slug inexistente ou `active = false`) MUST resultar em `notFound()` — mesmo tratamento para os dois casos, sem distinção visível ao visitante (FR-006, FR-007).
- Botão de compra é Client Component isolado (`BuyButton`) — único ponto da página com `"use client"`, já que precisa disparar `trackBuyClick` no `onClick`.
- `stock === 0` OU `ml_url` ausente → botão desabilitado, texto "Produto Indisponível", sem `href` (FR-005).

**Scale/Scope**: Uma página por produto ativo (~100 produtos), sem produtos relacionados/comentários (fora de escopo, por Assumptions do spec).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Único caminho de conversão é o botão "Comprar no Mercado Livre" (`target="_blank"` + GA/Pixel). Sem carrinho/checkout/login. | ✅ PASS |
| II. Server Component | Página é RSC; apenas `BuyButton` é Client (precisa disparar GA/Pixel no clique). | ✅ PASS |
| III. Design System | Galeria 1:1 com placeholder do design system quando vazia; ficha técnica usa componentes/tokens existentes. | ✅ PASS |
| IV. Segurança | Sem dado privado exposto — produto inativo é tratado como inexistente (404), nunca renderizado parcialmente. | ✅ PASS |
| V. Simplicidade | Sem relacionados/comentários/avaliações, conforme Assumptions do spec. Reaproveita `getProductBySlug`/`trackBuyClick` sem reescrever. | ✅ PASS |
| VI. TDD Obrigatório | Testes de `getProductBySlug` (404 para inexistente/inativo) e do `BuyButton` (estado indisponível) escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/003-pagina-produto/
├── plan.md   # Este arquivo — não há research.md/data-model.md/contracts/quickstart.md
│             # próprios; consulte os equivalentes em specs/001-vitrine-catalogo/
└── tasks.md  # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/(site)/produtos/[slug]/
│   └── page.tsx                  # RSC — chama getProductBySlug(slug); notFound() se null
└── features/produtos/
    ├── components/
    │   ├── ProductGallery.tsx     # RSC — galeria 1:1 com placeholder quando vazia
    │   ├── ProductSpecs.tsx        # RSC — ficha técnica/atributos
    │   └── BuyButton.tsx            # Client — único "use client" da página, dispara trackBuyClick
    ├── queries.ts                    # getProductBySlug(slug) — já contratada em 001
    └── index.ts                       # Barrel já previsto em 001
└── infrastructure/
    └── analytics.ts                   # trackBuyClick(slug) — já contratada em 001
```

**Structure Decision**: Nenhuma pasta nova — reaproveita `features/produtos/` e `infrastructure/analytics.ts` já planejados em 001. `app/(site)/produtos/[slug]/page.tsx` permanece composição pura: busca o produto e delega renderização aos componentes da feature.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
