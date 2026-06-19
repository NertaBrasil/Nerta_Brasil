---

description: "Task list for feature implementation"
---

# Tasks: Página de Detalhe do Produto

**Input**: Design documents from `specs/003-pagina-produto/` (plano fino — reaproveita stack/contratos de `specs/001-vitrine-catalogo/`)

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md). Sem `research.md`/`data-model.md`/`contracts/` próprios — consultar os equivalentes em `specs/001-vitrine-catalogo/`. Assume o scaffolding do projeto (Next.js, Tailwind, Supabase client, `shared/`, `infrastructure/`) já criado pela [spec 002](../002-catalogo-publico/tasks.md) — sem Fase 1 (Setup) própria.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T001 [P] Implementar `getProductBySlug(slug)` em `src/features/products/queries.ts` — retorna produto completo com `images` ordenadas por `position ASC`, ou `null` se inexistente ou `active = false`
- [ ] T002 [P] Implementar `trackBuyClick(product)` em `src/infrastructure/analytics.ts` — dispara eventos GA4 + Meta Pixel
- [ ] T003 [P] Garantir placeholder visual reaproveitável em `src/shared/components/ui/` para galeria sem imagens (reaproveitar o mesmo usado pelo `ProductCard` da spec 002, se já existir)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Ver detalhes completos de um produto (Priority: P1) 🎯 MVP

**Goal**: Visitante vê galeria 1:1, nome, linha comercial, descrição completa, ficha técnica e categoria de um produto ativo.

**Independent Test**: Acessar diretamente a URL de um produto ativo de seed e verificar que todas as informações aparecem corretamente.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [ ] T004 [P] [US1] Vitest: `getProductBySlug` retorna produto completo com galeria ordenada por `position`, em `src/features/products/queries.test.ts`
- [ ] T005 [P] [US1] RTL: `ProductGallery` exibe placeholder quando o produto não tem imagens, em `src/features/products/components/ProductGallery.test.tsx`
- [ ] T006 [P] [US1] RTL: `ProductSpecs` omite a seção sem quebrar o layout quando não há ficha técnica cadastrada (Edge Case), em `src/features/products/components/ProductSpecs.test.tsx`

### Implementation for User Story 1

- [ ] T007 [P] [US1] Implementar `ProductGallery.tsx` (RSC) em `src/features/products/components/ProductGallery.tsx` (depende de T003)
- [ ] T008 [P] [US1] Implementar `ProductSpecs.tsx` (RSC) em `src/features/products/components/ProductSpecs.tsx`
- [ ] T009 [US1] Implementar `src/app/(public)/produtos/[slug]/page.tsx` (RSC) — chama `getProductBySlug(slug)`, compõe galeria/specs/nome/linha/categoria (depende de T001, T007, T008)
- [ ] T010 [US1] Tratar categoria órfã (categoria excluída): exibir demais informações do produto normalmente, sem categoria inválida (Edge Case)
- [ ] T011 [US1] Exportar `ProductGallery`, `ProductSpecs` em `src/features/products/index.ts`

**Checkpoint**: User Story 1 funcional e testável de forma independente.

---

## Phase 3: User Story 2 - Seguir para a compra no Mercado Livre (Priority: P1)

**Goal**: Botão de compra abre o anúncio em nova aba e dispara analytics; fica desabilitado com "Produto Indisponível" quando `stock = 0` ou `ml_url` ausente.

**Independent Test**: Em um produto com estoque disponível, clicar no botão e verificar abertura de nova aba + disparo dos eventos de analytics.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [ ] T012 [P] [US2] Vitest: `trackBuyClick` dispara os parâmetros corretos para GA4 e Meta Pixel, em `src/infrastructure/analytics.test.ts`
- [ ] T013 [P] [US2] RTL: `BuyButton` habilitado com `target="_blank"` quando `stock > 0` e `ml_url` presente; desabilitado com texto "Produto Indisponível" e sem `href` quando `stock === 0` OU `ml_url` ausente, em `src/features/products/components/BuyButton.test.tsx`

### Implementation for User Story 2

- [ ] T014 [US2] Implementar `BuyButton.tsx` (Client, único `"use client"` da página) em `src/features/products/components/BuyButton.tsx` — `onClick` dispara `trackBuyClick` antes/durante a abertura do link (depende de T002)
- [ ] T015 [US2] Integrar `BuyButton` em `src/app/(public)/produtos/[slug]/page.tsx` (depende de T009, T014)
- [ ] T016 [US2] Exportar `BuyButton` em `src/features/products/index.ts`

**Checkpoint**: User Stories 1 e 2 funcionam juntas e independentemente.

---

## Phase 4: User Story 3 - Tratamento de produto inexistente ou inativo (Priority: P2)

**Goal**: Slug inexistente e produto inativo retornam 404 de forma idêntica, sem vazar informação sobre produtos inativos.

**Independent Test**: Acessar uma URL com slug inexistente e, separadamente, a URL de um produto `active = false`; verificar 404 em ambos os casos.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [ ] T017 [P] [US3] Vitest: `getProductBySlug` retorna `null` tanto para slug inexistente quanto para produto com `active = false` (mesmo retorno, sem diferenciação), em `src/features/products/queries.test.ts`
- [ ] T018 [P] [US3] Teste de integração: `app/(public)/produtos/[slug]/page.tsx` chama `notFound()` do Next.js quando `getProductBySlug` retorna `null`

### Implementation for User Story 3

- [ ] T019 [US3] Confirmar que `src/app/(public)/produtos/[slug]/page.tsx` chama `notFound()` para ambos os casos de `null` (já implementado em T009 — esta task valida que não há branch alternativa que distinga os dois casos)

**Checkpoint**: Todas as user stories funcionais independentemente.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T020 [P] Validar manualmente os cenários de `specs/001-vitrine-catalogo/quickstart.md` §2.3/§2.4 referentes à página de produto
- [ ] T021 Rodar oxlint em `src/features/products/components/` (`ProductGallery`, `ProductSpecs`, `BuyButton`) e em `src/app/(public)/produtos/[slug]/` — zero violações do design system

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende apenas do scaffolding já criado pela spec 002. Bloqueia todas as user stories.
- **User Stories (Phase 2-4)**: dependem de Foundational. US1 é o MVP (conteúdo visível); US2 depende de US1 ter a página montada (`page.tsx`), mas `BuyButton` em si é testável isoladamente; US3 reaproveita o `getProductBySlug` de US1, apenas adicionando os testes/garantias do caminho 404.
- **Polish (Phase 5)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T001-T003 (Foundational) em paralelo.
- T004-T006 (testes US1) em paralelo; T007-T008 (US1) em paralelo entre si.
- T012-T013 (testes US2) em paralelo.
- T017-T018 (testes US3) em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Foundational.
2. Completar Fase 2 (US1) — página exibe todas as informações, sem botão de compra funcional ainda.
3. Validar US1 isoladamente.

### Incremental Delivery

1. Foundational → fundação pronta.
2. US1 → testar independentemente → conteúdo completo visível.
3. US2 → testar independentemente → conversão para Mercado Livre funcional (objetivo de negócio).
4. US3 → testar independentemente → integridade do catálogo (404 consistente).

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
