---

description: "Task list for feature implementation"
---

# Tasks: Gestão de Categorias no Painel Administrativo

**Input**: Design documents from `specs/006-admin-categorias/` (plano fino — reaproveita stack/contratos de `specs/001-vitrine-catalogo/`)

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md). Sem `research.md`/`data-model.md`/`contracts/` próprios — consultar os equivalentes em `specs/001-vitrine-catalogo/`. Assume o scaffolding do projeto (spec 002) e a fundação administrativa — `middleware.ts`, `getCurrentAdminProfile()`, `(admin)/layout.tsx`, Sidebar (spec 005) — já existentes.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T001 [P] Criar `categorySchema` (Zod) em `src/features/admin/categories/schemas.ts` — nome obrigatório, slug derivado/editável, ambos não vazios
- [ ] T002 Implementar `CategoryList.tsx` (RSC) em `src/features/admin/categories/components/CategoryList.tsx` — usa `getCategories()` (já implementada em `features/products/queries.ts` pela spec 002) para exibir a listagem completa de categorias, independentemente de terem produtos vinculados (FR-008)
- [ ] T003 Implementar `src/app/(admin)/categorias/page.tsx` (RSC) compondo `CategoryList` (depende de T002)
- [ ] T004 Criar `src/features/admin/categories/index.ts` (barrel inicialmente vazio, populado pelas user stories)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Criar uma nova categoria (Priority: P1) 🎯 MVP

**Goal**: Usuário autenticado cria uma categoria informando nome; slug é gerado automaticamente e pode ser editado antes de salvar.

**Independent Test**: Autenticado como admin/editor, preencher o formulário de nova categoria e verificar que ela aparece na listagem com nome e slug corretos.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [ ] T005 [P] [US1] Vitest: `createCategory` gera slug a partir do nome quando não informado, aceita slug customizado, e rejeita nome/slug já usados por outra categoria com erro de duplicidade, em `src/features/admin/categories/actions.test.ts`
- [ ] T006 [P] [US1] RTL: `CategoryForm` sugere slug a partir do nome digitado e permite edição manual antes de salvar, em `src/features/admin/categories/components/CategoryForm.test.tsx`

### Implementation for User Story 1

- [ ] T007 [US1] Implementar `createCategory(input)` em `src/features/admin/categories/actions.ts` (depende de T001)
- [ ] T008 [US1] Implementar `CategoryForm.tsx` (Client) em `src/features/admin/categories/components/CategoryForm.tsx` — modo criação, sugestão de slug via `slugify()` (`shared/utils.ts`), edição manual, chama `createCategory()`
- [ ] T009 [US1] Integrar `CategoryForm` em `src/app/(admin)/categorias/page.tsx` como entrada para nova categoria (depende de T003, T008)
- [ ] T010 [US1] Tratar Edge Case: nome que gera slug vazio/inválido — impedir submissão até um slug válido ser informado
- [ ] T011 [US1] Exportar `createCategory`, `CategoryForm` em `src/features/admin/categories/index.ts`

**Checkpoint**: User Story 1 funcional e testável de forma independente.

---

## Phase 3: User Story 4 - Tentar excluir categoria com produtos vinculados (Priority: P1)

**Goal**: Exclusão de categoria com produtos vinculados é bloqueada, com mensagem clara pedindo reclassificação prévia.

**Independent Test**: Com uma categoria de seed vinculada a ao menos um produto, tentar excluí-la e verificar bloqueio com mensagem explicativa.

### Tests for User Story 4 (MANDATORY — write first, must fail) ⚠️

- [ ] T012 [P] [US4] Vitest: `deleteCategory` bloqueia a exclusão e retorna mensagem explicativa quando há produtos vinculados; permite a exclusão quando os produtos foram reclassificados (nenhum vínculo restante), em `src/features/admin/categories/actions.test.ts`
- [ ] T013 [P] [US4] RTL: `DeleteCategoryModal` exibe a mensagem de bloqueio retornada por `deleteCategory` quando há vínculo, em `src/features/admin/categories/components/DeleteCategoryModal.test.tsx`

### Implementation for User Story 4

- [ ] T014 [US4] Implementar `deleteCategory(id)` em `src/features/admin/categories/actions.ts` — verifica vínculo com `products` antes do `DELETE`, retorna erro explicativo se houver produtos vinculados (depende de T001)
- [ ] T015 [US4] Implementar `DeleteCategoryModal.tsx` (Client) em `src/features/admin/categories/components/DeleteCategoryModal.tsx` — confirmação com scrim escuro (FR-006), exibe a mensagem de bloqueio quando retornada
- [ ] T016 [US4] Integrar `DeleteCategoryModal` em `CategoryList.tsx` como ação de exclusão por categoria (depende de T002, T015)
- [ ] T017 [US4] Exportar `deleteCategory`, `DeleteCategoryModal` em `src/features/admin/categories/index.ts`

**Checkpoint**: User Stories 1 e 4 funcionam juntas — regra de negócio crítica garantida desde o início.

---

## Phase 4: User Story 2 - Editar uma categoria existente (Priority: P2)

**Goal**: Usuário autenticado altera nome e/ou slug de uma categoria; mudança se reflete em toda a interface e nos produtos vinculados.

**Independent Test**: Com uma categoria de seed, editar seu nome e verificar a alteração refletida na listagem e nos produtos vinculados.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [ ] T018 [P] [US2] Vitest: `updateCategory` atualiza nome/slug com sucesso e rejeita slug que já pertence a outra categoria, em `src/features/admin/categories/actions.test.ts`
- [ ] T019 [P] [US2] RTL: `CategoryForm` em modo edição pré-popula nome/slug existentes e permite alteração, em `src/features/admin/categories/components/CategoryForm.test.tsx`

### Implementation for User Story 2

- [ ] T020 [US2] Implementar `updateCategory(id, input)` em `src/features/admin/categories/actions.ts` (depende de T001)
- [ ] T021 [US2] Adaptar `CategoryForm.tsx` para suportar modo edição (recebe categoria existente via props) (depende de T008)
- [ ] T022 [US2] Integrar modo edição em `CategoryList.tsx`/`page.tsx` como ação de editar por categoria (depende de T002, T021)
- [ ] T023 [US2] Exportar `updateCategory` em `src/features/admin/categories/index.ts`

**Checkpoint**: User Stories 1, 4 e 2 funcionam juntas.

---

## Phase 5: User Story 3 - Excluir uma categoria sem produtos vinculados (Priority: P2)

**Goal**: Categoria sem produtos vinculados é excluída permanentemente após confirmação.

**Independent Test**: Criar uma categoria sem produtos vinculados, excluí-la, e verificar que desaparece da listagem.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [ ] T024 [P] [US3] Vitest: `deleteCategory` exclui com sucesso quando não há produtos vinculados (cenário complementar ao bloqueio de US4), em `src/features/admin/categories/actions.test.ts`
- [ ] T025 [P] [US3] RTL: `DeleteCategoryModal` confirma exclusão com sucesso e a categoria deixa de aparecer na listagem, em `src/features/admin/categories/components/DeleteCategoryModal.test.tsx`

### Implementation for User Story 3

- [ ] T026 [US3] Garantir que `DeleteCategoryModal` (T015) trata o caminho de sucesso — fecha o modal e a listagem reflete a remoção quando não há produtos vinculados (depende de T015, T016)

**Checkpoint**: Todas as user stories funcionais independentemente.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T027 [P] Validar manualmente os cenários de `specs/001-vitrine-catalogo/quickstart.md` referentes à gestão de categorias
- [ ] T028 Rodar oxlint em `src/features/admin/categories/` e `src/app/(admin)/categorias/` — zero violações do design system

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende do scaffolding (002) e da fundação administrativa (005). Bloqueia todas as user stories.
- **User Stories (Phase 2-5)**: ordenadas por prioridade do spec.md — US1 e US4 (ambas P1) formam o MVP real (criar + bloqueio de exclusão indevida); US2 e US4 compartilham `actions.ts`/`CategoryForm.tsx` mas são incrementos independentes; US3 reaproveita o `DeleteCategoryModal` introduzido em US4, apenas cobrindo o caminho de sucesso.
- **Polish (Phase 6)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T005-T006 (testes US1) em paralelo.
- T012-T013 (testes US4) em paralelo.
- T018-T019 (testes US2) em paralelo.
- T024-T025 (testes US3) em paralelo.

---

## Implementation Strategy

### MVP First (User Stories 1 + 4)

1. Completar Foundational.
2. Completar Fase 2 (US1) e Fase 3 (US4) — sem US4, a regra de negócio crítica do spec (bloqueio de exclusão indevida) não está garantida.
3. Validar US1+US4 juntas.

### Incremental Delivery

1. Foundational → fundação pronta (listagem completa de categorias).
2. US1 → testar independentemente → criação funcional.
3. US4 → testar independentemente → regra de negócio crítica garantida (MVP real desta spec).
4. US2 → testar independentemente → edição.
5. US3 → testar independentemente → exclusão no caminho permitido.

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
