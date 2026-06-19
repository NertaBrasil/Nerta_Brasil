---

description: "Task list for feature implementation"
---

# Tasks: Gestão de Produtos (CRUD) no Painel Administrativo

**Input**: Design documents from `specs/007-admin-produtos-crud/` (plano fino — reaproveita stack/contratos de `specs/001-vitrine-catalogo/`)

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md). Sem `research.md`/`data-model.md`/`contracts/` próprios — consultar os equivalentes em `specs/001-vitrine-catalogo/`. Assume o scaffolding (002), a fundação administrativa (005) e a gestão de categorias (006, para `getCategories()` e o seletor de categoria) já existentes.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T001 [P] Criar `productSchema` (Zod) em `src/features/admin/products/schemas.ts` — nome, linha comercial, descrição curta, descrição completa, ficha técnica, `category_id` (uuid de categoria existente), estoque (inteiro não-negativo), `active` (boolean), `ml_url`
- [ ] T002 Implementar `getAllProducts()` em `src/features/admin/products/queries.ts` — retorna todos os produtos (ativos e inativos), com categoria e imagem de capa, para a listagem administrativa (FR-010); não exige checagem de papel própria (contexto já protegido por `middleware.ts`/`(admin)/layout.tsx`, ver Convenção de Arquitetura §1)
- [ ] T003 Implementar `ProductList.tsx` (RSC) em `src/features/admin/products/components/ProductList.tsx` — usa `getAllProducts()`, exibe status ativo/inativo de cada produto (depende de T002)
- [ ] T004 Implementar `src/app/(admin)/produtos/page.tsx` (RSC) compondo `ProductList` (depende de T003)
- [ ] T005 Criar `src/features/admin/products/index.ts` (barrel inicialmente vazio, populado pelas user stories)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Cadastrar um novo produto (Priority: P1) 🎯 MVP

**Goal**: Usuário autenticado cadastra um produto completo com categoria existente; slug gerado automaticamente e editável.

**Independent Test**: Autenticado como admin/editor, preencher o formulário de novo produto com uma categoria existente e verificar que ele aparece na listagem administrativa com todos os dados corretos.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [ ] T006 [P] [US1] Vitest: `createProduct` gera slug a partir do nome, aceita slug customizado, rejeita slug duplicado, exige `category_id` de categoria existente, e rejeita estoque negativo, em `src/features/admin/products/actions.test.ts`
- [ ] T007 [P] [US1] RTL: `ProductForm` sugere slug a partir do nome digitado, permite edição manual, e exibe erro de validação quando um campo obrigatório (nome ou categoria) está ausente, em `src/features/admin/products/components/ProductForm.test.tsx`

### Implementation for User Story 1

- [ ] T008 [US1] Implementar `createProduct(input)` em `src/features/admin/products/actions.ts` (depende de T001)
- [ ] T009 [US1] Implementar `ProductForm.tsx` (Client) em `src/features/admin/products/components/ProductForm.tsx` — modo criação, sugestão de slug via `slugify()`, seletor de categoria populado por `getCategories()` (spec 006), chama `createProduct()`
- [ ] T010 [US1] Implementar `src/app/(admin)/produtos/novo/page.tsx` (RSC) compondo `ProductForm` em modo criação (depende de T009)
- [ ] T011 [US1] Tratar Edge Case: categoria excluída entre o carregamento do formulário e a submissão — `createProduct` rejeita com erro claro pedindo categoria válida
- [ ] T012 [US1] Exportar `createProduct`, `ProductForm` em `src/features/admin/products/index.ts`

**Checkpoint**: User Story 1 funcional e testável de forma independente.

---

## Phase 3: User Story 2 - Editar um produto existente (Priority: P1)

**Goal**: Usuário autenticado altera qualquer atributo de um produto existente; mudanças refletem na vitrine pública quando aplicável.

**Independent Test**: Com um produto de seed, editar nome e estoque e verificar reflexo na listagem administrativa e na vitrine pública.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [ ] T013 [P] [US2] Vitest: `updateProduct` atualiza atributos com sucesso, rejeita slug que já pertence a outro produto, rejeita categoria inválida/excluída, e rejeita estoque negativo, em `src/features/admin/products/actions.test.ts`
- [ ] T014 [P] [US2] RTL: `ProductForm` em modo edição pré-popula os campos existentes e salva as alterações, em `src/features/admin/products/components/ProductForm.test.tsx`

### Implementation for User Story 2

- [ ] T015 [US2] Implementar `updateProduct(input)` em `src/features/admin/products/actions.ts` (depende de T001)
- [ ] T016 [US2] Adaptar `ProductForm.tsx` para suportar modo edição (recebe produto existente via props) (depende de T009)
- [ ] T017 [US2] Implementar `src/app/(admin)/produtos/[id]/page.tsx` (RSC) compondo `ProductForm` em modo edição (depende de T016)
- [ ] T018 [US2] Exportar `updateProduct` em `src/features/admin/products/index.ts`

**Checkpoint**: User Stories 1 e 2 funcionam juntas — ciclo básico de manutenção do catálogo completo.

---

## Phase 4: User Story 3 - Ativar ou desativar um produto (Priority: P1)

**Goal**: Usuário autenticado alterna o status de um produto entre ativo/inativo, controlando visibilidade pública sem excluí-lo; estoque e status são controles independentes.

**Independent Test**: Com um produto ativo de seed, desativá-lo e verificar que desaparece da vitrine pública mas permanece visível/editável no admin.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [ ] T019 [P] [US3] Vitest: alternar `active` via `updateProduct` não altera o valor de estoque e vice-versa — status e estoque são controles independentes (Edge Case), em `src/features/admin/products/actions.test.ts`
- [ ] T020 [P] [US3] RTL: ação de alternar status em `ProductList` reflete imediatamente sem exigir reabertura do formulário completo, em `src/features/admin/products/components/ProductList.test.tsx`

### Implementation for User Story 3

- [ ] T021 [US3] Implementar toggle de status rápido em `ProductList.tsx` — chama `updateProduct({ id, active })` diretamente da listagem, satisfazendo o máximo de 1 interação principal (SC-004) (depende de T002, T015)
- [ ] T022 [US3] Confirmar que produto inativo permanece visível/editável no admin, apenas oculto da vitrine pública (já garantido por `getProducts()` da spec 002 filtrar `active = true`; esta task documenta/valida o comportamento, sem nova query)

**Checkpoint**: User Stories 1, 2 e 3 funcionam juntas — ciclo completo de manutenção e visibilidade do catálogo.

---

## Phase 5: User Story 4 - Excluir um produto (Priority: P2)

**Goal**: Produto é excluído permanentemente, junto com suas imagens vinculadas, mediante confirmação com scrim escuro.

**Independent Test**: Criar um produto de teste, excluí-lo, e verificar que desaparece completamente de toda listagem (pública e administrativa).

### Tests for User Story 4 (MANDATORY — write first, must fail) ⚠️

- [ ] T023 [P] [US4] Vitest: `deleteProduct` exclui o produto e todas as imagens vinculadas em cascade (cascade já contratado em 001), em `src/features/admin/products/actions.test.ts`
- [ ] T024 [P] [US4] RTL: `DeleteProductModal` exige confirmação explícita com scrim escuro antes de executar a exclusão, em `src/features/admin/products/components/DeleteProductModal.test.tsx`

### Implementation for User Story 4

- [ ] T025 [US4] Implementar `deleteProduct(id)` em `src/features/admin/products/actions.ts` — exclui produto e `product_images` vinculadas em cascade, remove arquivos do Storage (já contratado em 001)
- [ ] T026 [US4] Implementar `DeleteProductModal.tsx` (Client) em `src/features/admin/products/components/DeleteProductModal.tsx` — confirmação com scrim escuro (FR-009)
- [ ] T027 [US4] Integrar `DeleteProductModal` em `ProductList.tsx` como ação de exclusão por produto (depende de T002, T026)
- [ ] T028 [US4] Exportar `deleteProduct`, `DeleteProductModal` em `src/features/admin/products/index.ts`

**Checkpoint**: Todas as user stories funcionais independentemente.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T029 [P] Validar manualmente os cenários de `specs/001-vitrine-catalogo/quickstart.md` referentes ao CRUD de produtos
- [ ] T030 Rodar oxlint em `src/features/admin/products/` e `src/app/(admin)/produtos/` — zero violações do design system

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende do scaffolding (002), da fundação administrativa (005) e de categorias (006). Bloqueia todas as user stories.
- **User Stories (Phase 2-5)**: ordenadas por prioridade do spec.md — US1, US2 e US3 (todas P1) formam juntas o ciclo básico de manutenção do catálogo; US4 (P2) é a operação de limpeza definitiva, menos frequente.
- **Polish (Phase 6)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T006-T007 (testes US1) em paralelo.
- T013-T014 (testes US2) em paralelo.
- T019-T020 (testes US3) em paralelo.
- T023-T024 (testes US4) em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Foundational.
2. Completar Fase 2 (US1) — cadastro funcional.
3. Validar US1 isoladamente.

### Incremental Delivery

1. Foundational → fundação pronta (listagem administrativa completa).
2. US1 → testar independentemente → cadastro funcional (MVP).
3. US2 → testar independentemente → edição.
4. US3 → testar independentemente → controle de visibilidade sem exclusão.
5. US4 → testar independentemente → exclusão definitiva.

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
- Especificamente fora de escopo (FR-012): upload/crop/galeria de imagens (spec 008) e gestão de destaques (spec 009).
