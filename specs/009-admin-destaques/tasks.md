---

description: "Task list for feature implementation"
---

# Tasks: Gestão de Produtos em Destaque no Painel Administrativo

**Input**: Design documents from `specs/009-admin-destaques/`

**Prerequisites**: [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/server-actions.md](./contracts/server-actions.md), [spec.md](./spec.md). Assume o scaffolding (002), a fundação administrativa (005) e o CRUD básico de produtos (007) já existentes — produtos já devem existir para serem marcados como destaque. Diferente de 006/007/008, esta spec **não** é um plano fino: introduz uma alteração de schema própria (`products.featured_position`).

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T001 Criar migração de schema adicionando `products.featured_position int NULL` e o índice único parcial `products_featured_position_unique ON products (featured_position) WHERE featured_position IS NOT NULL` (ver `data-model.md`)
- [ ] T002 [P] Criar `types.ts` em `src/features/admin/destaques/types.ts` com `ReorderFeaturedInput = { productIds: string[] }`
- [ ] T003 [P] Implementar `FeaturedGrid.tsx` (Client, shell inicial) em `src/features/admin/destaques/components/FeaturedGrid.tsx` — renderiza os produtos com `featured = true` ordenados por `featured_position ASC`, reaproveitando `ProductCard`; exibe estado vazio claro quando não há nenhum (FR-003, FR-008)
- [ ] T004 Criar `app/(admin)/destaques/page.tsx` (RSC) compondo `FeaturedGrid` (depende de T003)
- [ ] T005 Exportar `FeaturedGrid` em `src/features/admin/destaques/index.ts`

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Marcar um produto como destaque (Priority: P1) 🎯 MVP

**Goal**: Usuário autenticado marca um produto (ativo ou inativo) como destaque, e ele passa a aparecer na grade de destaques do admin.

**Independent Test**: Com um produto ativo de seed sem a flag de destaque, marcá-lo como destaque, e verificar que ele aparece na grade de destaques do admin.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [ ] T006 [P] [US1] Vitest: `toggleFeatured(id, true)` atribui `featured_position = MAX(featured_position) + 1` entre os produtos atualmente destacados, ou `1` se nenhum estiver destacado, em `src/features/admin/destaques/actions.test.ts`
- [ ] T007 [P] [US1] Vitest: `toggleFeatured(id, true)` é idempotente — marcar um produto já destacado não altera sua `featured_position` (Edge Case de idempotência)
- [ ] T008 [P] [US1] Vitest: `toggleFeatured(id, true)` permite marcar um produto inativo como destaque (Acceptance Scenario 2), em `src/features/admin/destaques/actions.test.ts`
- [ ] T009 [P] [US1] RTL: toggle de destaque em `FeaturedGrid`/lista de produtos é acionado em 1 interação (SC-001), em `src/features/admin/destaques/components/FeaturedGrid.test.tsx`

### Implementation for User Story 1

- [ ] T010 [US1] Implementar `toggleFeatured(product_id, featured)` (caminho de marcação) em `src/features/admin/destaques/actions.ts` — calcula `next_position` e faz `UPDATE` dentro de uma transação (depende de T001); exige `role IN ('admin', 'editor')` via `getCurrentAdminProfile()`
- [ ] T011 [US1] Atualizar `getFeaturedProducts()` (já contratada em 001, reaproveitada por 004) para incluir `ORDER BY featured_position ASC`
- [ ] T012 [US1] Adicionar controle de toggle (marcar) na listagem de produtos (`ProductList.tsx`, spec 007) chamando `toggleFeatured()` (depende de T010)
- [ ] T013 [US1] Exportar `toggleFeatured` em `src/features/admin/destaques/index.ts`

**Checkpoint**: User Story 1 funcional e testável de forma independente — MVP da feature.

---

## Phase 3: User Story 2 - Desmarcar um produto como destaque (Priority: P1)

**Goal**: Usuário autenticado remove a marcação de destaque de um produto, e ele deixa de aparecer na grade de destaques e na home pública.

**Independent Test**: Com um produto de seed já marcado como destaque, desmarcá-lo, e verificar que ele desaparece da grade de destaques do admin.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [ ] T014 [P] [US2] Vitest: `toggleFeatured(id, false)` define `featured_position = NULL` e não renumera os demais produtos destacados, em `src/features/admin/destaques/actions.test.ts`

### Implementation for User Story 2

- [ ] T015 [US2] Implementar o caminho de desmarcação em `toggleFeatured()` (mesma função de T010, ramo `featured === false`) em `src/features/admin/destaques/actions.ts`
- [ ] T016 [US2] Adicionar controle de toggle (desmarcar) em `FeaturedGrid.tsx`, chamando `toggleFeatured(id, false)` (depende de T003, T015)

**Checkpoint**: User Stories 1 e 2 funcionam juntas — curadoria completa de marcar/desmarcar.

---

## Phase 4: User Story 3 - Reordenar a grade de destaques (Priority: P2)

**Goal**: Usuário autenticado arrasta e solta produtos na grade de destaques para definir a ordem de exibição na home pública.

**Independent Test**: Com dois ou mais produtos marcados como destaque, reordená-los via drag-and-drop, e verificar que a nova ordem persiste e se reflete na home pública.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [ ] T017 [P] [US3] Vitest: `reorderFeatured(productIds)` rejeita quando `productIds` não corresponde exatamente ao conjunto atual de produtos destacados (tamanho, IDs ou duplicados divergentes), retornando `{ success: false, error: ... }` sem aplicar alteração, em `src/features/admin/destaques/actions.test.ts`
- [ ] T018 [P] [US3] Vitest: `reorderFeatured(productIds)` atualiza `featured_position` de todos os produtos destacados para `índice + 1`, em uma única transação atômica
- [ ] T019 [P] [US3] RTL: drag-and-drop em `FeaturedGrid` persiste a nova ordem chamando `reorderFeatured()`, em `src/features/admin/destaques/components/FeaturedGrid.test.tsx`

### Implementation for User Story 3

- [ ] T020 [US3] Implementar `reorderFeatured(input: ReorderFeaturedInput)` em `src/features/admin/destaques/actions.ts` — valida correspondência exata com o conjunto atual de destacados, depois reescreve `featured_position` de todos atomicamente (depende de T002)
- [ ] T021 [US3] Adicionar drag-and-drop em `FeaturedGrid.tsx`, chamando `reorderFeatured()` ao soltar um produto em nova posição (depende de T003, T020)
- [ ] T022 [US3] Exportar `reorderFeatured` em `src/features/admin/destaques/index.ts`

**Checkpoint**: Todas as user stories funcionais independentemente.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T023 [P] Validar manualmente os cenários de `quickstart.md` desta spec
- [ ] T024 Rodar oxlint em `src/features/admin/destaques/components/FeaturedGrid.tsx` — zero violações do design system
- [ ] T025 Confirmar que a exclusão permanente de um produto destacado (via `deleteProduct`, 007) remove automaticamente sua linha de `products` e, portanto, sua presença na grade de destaques, sem lógica adicional (FR-006, SC-004, ver `data-model.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende do scaffolding (002), da fundação administrativa (005) e do CRUD de produtos (007). Bloqueia todas as user stories. Inclui a migração de schema própria desta feature (T001), diferente de 006/007/008.
- **User Stories (Phase 2-4)**: US1 é o MVP (sem marcação, a home nunca exibe destaques curados); US2 é o complemento direto de US1 e reaproveita a mesma função `toggleFeatured`; US3 depende de pelo menos dois produtos destacados (resultado de US1) para ser testada de ponta a ponta, mas opera sobre o mesmo `FeaturedGrid.tsx` introduzido na Foundational.
- **Polish (Phase 5)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T002-T003 (Foundational, arquivos diferentes) em paralelo.
- T006-T009 (testes US1) em paralelo.
- T017-T019 (testes US3) em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Foundational (inclui migração de schema).
2. Completar Fase 2 (US1) — marcação funcional.
3. Validar US1 isoladamente.

### Incremental Delivery

1. Foundational → schema e grade prontos (vazia).
2. US1 → testar independentemente → marcação funcional (MVP).
3. US2 → testar independentemente → desmarcação funcional.
4. US3 → testar independentemente → reordenação por drag-and-drop refletida na home.

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
- `toggleFeatured` é uma única função com dois ramos (marcar/desmarcar) — T010 (US1) e T015 (US2) implementam ramos da mesma função, não funções separadas.
