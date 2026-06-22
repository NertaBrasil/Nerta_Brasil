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

- [X] T001 Criar migração de schema adicionando `products.featured_position int NULL` e o índice único parcial `products_featured_position_unique ON products (featured_position) WHERE featured_position IS NOT NULL` (ver `data-model.md`) — `db/migrations/0003_products_featured_position.{up,down}.sql`, validado localmente (UP/DOWN/UP) contra `supabase_db_Nerta_Brasil`; equivalente CLI em `supabase/migrations/20260622183450_products_featured_position.sql`, confirmado via `supabase db reset`; registrado em `db/controle/MIGRATIONS.md`.
- [X] T002 [P] Criar `types.ts` em `src/features/admin/featured/types.ts` com `ReorderFeaturedInput = { productIds: string[] }`
- [X] T003 [P] Implementar `FeaturedGrid.tsx` (Client, shell inicial) em `src/features/admin/featured/components/FeaturedGrid.tsx` — renderiza os produtos com `featured = true` ordenados por `featured_position ASC`; exibe estado vazio claro quando não há nenhum (FR-003, FR-008). **Desvio documentado**: não reaproveita `ProductCard` literalmente — esse componente envolve o card inteiro num `<Link>` para a página pública do produto, o que conflita com os controles administrativos (drag handle, botão "Remover destaque") que precisam ser interativos por si mesmos. Implementado com `Card` (mesmo primitivo de design system usado por `ProductCard`) diretamente, mantendo a mesma linguagem visual sem aninhar `<button>` dentro de `<a>`.
- [X] T004 Criar `app/admin/(protected)/destaques/page.tsx` (RSC) compondo `FeaturedGrid` (depende de T003) — caminho corrigido: `(admin)` não existe neste projeto (ver CLAUDE.md, route groups). Adicionado também o link "Destaques" em `Sidebar.tsx` (`NAV_LINKS`), não listado explicitamente nas tasks mas necessário para a tela ser navegável.
- [X] T005 Exportar `FeaturedGrid` em `src/features/admin/featured/index.ts` (junto com `getFeaturedProductsForAdmin`, `toggleFeatured`, `reorderFeatured` e os tipos — ver Notes sobre `queries.ts` não previsto explicitamente nas tasks)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Marcar um produto como destaque (Priority: P1) 🎯 MVP

**Goal**: Usuário autenticado marca um produto (ativo ou inativo) como destaque, e ele passa a aparecer na grade de destaques do admin.

**Independent Test**: Com um produto ativo de seed sem a flag de destaque, marcá-lo como destaque, e verificar que ele aparece na grade de destaques do admin.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [X] T006 [P] [US1] Vitest: `toggleFeatured(id, true)` atribui `featured_position = MAX(featured_position) + 1` entre os produtos atualmente destacados, ou `1` se nenhum estiver destacado, em `src/features/admin/featured/actions.test.ts`
- [X] T007 [P] [US1] Vitest: `toggleFeatured(id, true)` é idempotente — marcar um produto já destacado não altera sua `featured_position` (Edge Case de idempotência)
- [X] T008 [P] [US1] Vitest: `toggleFeatured(id, true)` permite marcar um produto inativo como destaque (Acceptance Scenario 2), em `src/features/admin/featured/actions.test.ts`
- [X] T009 [P] [US1] RTL: toggle de destaque em `FeaturedGrid`/lista de produtos é acionado em 1 interação (SC-001), em `src/features/admin/featured/components/FeaturedGrid.test.tsx` (cobertura complementar em `ProductRow.test.tsx`, ver T012)

### Implementation for User Story 1

- [X] T010 [US1] Implementar `toggleFeatured(product_id, featured)` (caminho de marcação) em `src/features/admin/featured/actions.ts` — calcula `next_position` e faz `UPDATE` (depende de T001); exige sessão válida via `getCurrentAdminProfile()`. **Desvio documentado**: sem transação real (supabase-js não suporta multi-statement sem função Postgres dedicada) — mesmo padrão já adotado em `reorderProductImages`/`deleteProductImage` (spec 008); idempotência e atomicidade lógica garantidas no nível da aplicação (verifica `featured` atual antes de calcular a nova posição).
- [X] T011 [US1] Implementar `getFeaturedProducts()` em `src/features/products/queries.ts` com `ORDER BY featured_position ASC` — **Nota importante**: esta função ainda não existia em `develop` (só existe na branch não mergeada `feature/004-home-landing`, PR #15, que a implementou sem ordenação). Implementada aqui já com `.order("featured_position", { ascending: true })`. **Risco de merge documentado**: quando PR #15 for mergeado, haverá conflito textual trivial em `queries.ts` (duas versões de `getFeaturedProducts`, quase idênticas) — resolver mantendo esta versão (com `ORDER BY`).
- [X] T012 [US1] Adicionar controle de toggle (marcar) na listagem de produtos (`ProductRow.tsx`, spec 007) chamando `toggleFeatured()` (depende de T010)
- [X] T013 [US1] Exportar `toggleFeatured` em `src/features/admin/featured/index.ts`

**Checkpoint**: User Story 1 funcional e testável de forma independente — MVP da feature.

---

## Phase 3: User Story 2 - Desmarcar um produto como destaque (Priority: P1)

**Goal**: Usuário autenticado remove a marcação de destaque de um produto, e ele deixa de aparecer na grade de destaques e na home pública.

**Independent Test**: Com um produto de seed já marcado como destaque, desmarcá-lo, e verificar que ele desaparece da grade de destaques do admin.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [X] T014 [P] [US2] Vitest: `toggleFeatured(id, false)` define `featured_position = NULL` e não renumera os demais produtos destacados, em `src/features/admin/featured/actions.test.ts`

### Implementation for User Story 2

- [X] T015 [US2] Implementar o caminho de desmarcação em `toggleFeatured()` (mesma função de T010, ramo `featured === false`) em `src/features/admin/featured/actions.ts`
- [X] T016 [US2] Adicionar controle de toggle (desmarcar) em `FeaturedGrid.tsx`, chamando `toggleFeatured(id, false)` (depende de T003, T015) — também disponível em `ProductRow.tsx` (mesmo botão alterna marcar/desmarcar, ver T012)

**Checkpoint**: User Stories 1 e 2 funcionam juntas — curadoria completa de marcar/desmarcar.

---

## Phase 4: User Story 3 - Reordenar a grade de destaques (Priority: P2)

**Goal**: Usuário autenticado arrasta e solta produtos na grade de destaques para definir a ordem de exibição na home pública.

**Independent Test**: Com dois ou mais produtos marcados como destaque, reordená-los via drag-and-drop, e verificar que a nova ordem persiste e se reflete na home pública.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [X] T017 [P] [US3] Vitest: `reorderFeatured(productIds)` rejeita quando `productIds` não corresponde exatamente ao conjunto atual de produtos destacados (tamanho, IDs ou duplicados divergentes), retornando `{ success: false, error: ... }` sem aplicar alteração, em `src/features/admin/featured/actions.test.ts`
- [X] T018 [P] [US3] Vitest: `reorderFeatured(productIds)` atualiza `featured_position` de todos os produtos destacados para `índice + 1` — **Desvio documentado**: updates sequenciais por linha, não uma transação real (mesmo motivo de T010/`reorderProductImages`, spec 008)
- [X] T019 [P] [US3] RTL: drag-and-drop em `FeaturedGrid` persiste a nova ordem chamando `reorderFeatured()`, em `src/features/admin/featured/components/FeaturedGrid.test.tsx`

### Implementation for User Story 3

- [X] T020 [US3] Implementar `reorderFeatured(input: ReorderFeaturedInput)` em `src/features/admin/featured/actions.ts` — valida correspondência exata com o conjunto atual de destacados, depois reescreve `featured_position` de todos (depende de T002)
- [X] T021 [US3] Adicionar drag-and-drop em `FeaturedGrid.tsx`, chamando `reorderFeatured()` ao soltar um produto em nova posição (depende de T003, T020) — implementado com eventos HTML5 nativos (`draggable`/`onDragStart`/`onDragOver`/`onDrop`), mesmo padrão de `ImageGallery.tsx` (spec 008), sem biblioteca adicional
- [X] T022 [US3] Exportar `reorderFeatured` em `src/features/admin/featured/index.ts`

**Checkpoint**: Todas as user stories funcionais independentemente.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T023 [P] Validar manualmente os cenários de `quickstart.md` desta spec — **Pendente**: requer sessão autenticada real no admin (sem credenciais disponíveis nesta sessão); recomendado teste manual rápido ao revisar o PR (marcar 2-3 produtos como destaque, reordenar via drag-and-drop, desmarcar um, confirmar reflexo na home pública após o merge de PR #15/#19).
- [X] T024 Rodar oxlint em `src/features/admin/featured/components/FeaturedGrid.tsx` — zero violações do design system (confirmado: `oxlint src` → 0 warnings, 0 errors, repositório completo)
- [X] T025 Confirmar que a exclusão permanente de um produto destacado (via `deleteProduct`, 007) remove automaticamente sua linha de `products` e, portanto, sua presença na grade de destaques, sem lógica adicional (FR-006, SC-004, ver `data-model.md`) — confirmado por inspeção: `deleteProduct` faz `DELETE FROM products WHERE id = ...`; `featured_position` é coluna da própria linha excluída, não há FK/tabela separada a limpar.

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
- **Adição não prevista nas tasks**: criado `src/features/admin/featured/queries.ts` com `getFeaturedProductsForAdmin()` — necessário porque a grade do admin precisa listar produtos destacados **independentemente** de `active` (Edge Case da spec: produto destacado desativado permanece na grade do admin, só desaparece da home pública). `getFeaturedProducts()` (T011, em `features/products`) filtra `active = true` e por isso não serve para alimentar `FeaturedGrid` no admin. Usa `createClient()` (sessão do usuário) e não `createAdminClient()`, apoiado na policy RLS `products_select_authenticated_all` já existente — mesmo padrão de `getAllProducts()` (spec 007). Sem teste dedicado, seguindo o mesmo precedente de `getProductById`/`getAllProducts()` (leituras simples sem regra de negócio adicional).
