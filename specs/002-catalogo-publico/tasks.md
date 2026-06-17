---

description: "Task list for feature implementation"
---

# Tasks: Catálogo Público de Produtos

**Input**: Design documents from `specs/002-catalogo-publico/` (plano fino — reaproveita stack/contratos de `specs/001-vitrine-catalogo/`)

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md). Sem `research.md`/`data-model.md`/`contracts/` próprios — consultar os equivalentes em `specs/001-vitrine-catalogo/`.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

**Nota de ordem de implementação**: Esta é a primeira spec granular com `tasks.md` gerado; o repositório ainda não tem `src/` (ver `package.json`/scaffolding inexistentes). Por isso a Fase 1 (Setup) e parte da Fase 2 (Foundational) cobrem o bootstrap do projeto inteiro, não apenas desta feature. Specs subsequentes (003, 004, ...) assumem esse scaffolding já existente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Inicializar projeto Next.js 14+ (App Router) com TypeScript em `package.json`, `next.config.ts`, `tsconfig.json` na raiz do repositório
- [ ] T002 [P] Configurar Tailwind CSS (`tailwind.config.ts`, `postcss.config.js`) e tokens iniciais do design system em `src/app/globals.css`
- [ ] T003 [P] Configurar oxlint para enforcement do design system (Princípio III) na raiz do repositório
- [ ] T004 [P] Criar `.env.example` com `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — nunca commitar `.env`/`.env.local`
- [ ] T005 [P] Configurar Vitest + React Testing Library (Princípio VI) em `vitest.config.ts`
- [ ] T006 Criar estrutura de pastas base `src/app/`, `src/features/`, `src/shared/`, `src/infrastructure/` per `specs/001-vitrine-catalogo/plan.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T007 [P] Implementar `src/infrastructure/supabase/client.ts` (`createBrowserClient` via `@supabase/ssr`)
- [ ] T008 [P] Implementar `src/infrastructure/supabase/server.ts` (`createServerClient` via `@supabase/ssr`)
- [ ] T009 [P] Criar `src/shared/types.ts` com `ActionResult<T>`
- [ ] T010 [P] Criar `src/shared/utils.ts` com `slugify()` e `cn()`
- [ ] T011 [P] Criar primitivas `src/shared/components/ui/Badge.tsx` e `src/shared/components/ui/Card.tsx` (usadas pelo indicador de indisponibilidade do `ProductCard`)
- [ ] T012 Criar `src/features/produtos/types.ts` com `Product`, `Category`, `ProductImage` (dono único — ver `001-vitrine-catalogo/contracts/types.ts`)
- [ ] T013 Criar `src/features/produtos/index.ts` (barrel inicialmente vazio, populado pelas user stories)
- [ ] T014 Criar `src/app/layout.tsx` (RSC raiz, importa `globals.css`)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 3: User Story 1 - Navegar pelo catálogo completo (Priority: P1) 🎯 MVP

**Goal**: Visitante vê todos os produtos ativos em cards, com indicador de indisponibilidade quando `stock = 0`, sem produtos inativos.

**Independent Test**: Acessar `/produtos` com produtos de seed (ativos, inativos, estoque zero) e verificar a listagem renderizada.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [ ] T015 [P] [US1] Vitest: `getProducts()` retorna apenas `active = true`, inclui produtos com `stock = 0`, em `src/features/produtos/queries.test.ts`
- [ ] T016 [P] [US1] RTL: `ProductCard` exibe indicador de indisponibilidade quando `stock === 0` e placeholder quando `cover_image` é `null`, em `src/features/produtos/components/ProductCard.test.tsx`

### Implementation for User Story 1

- [ ] T017 [US1] Implementar `getProducts(filters?)` em `src/features/produtos/queries.ts` (depende de T012)
- [ ] T018 [P] [US1] Implementar `ProductCard.tsx` em `src/features/produtos/components/ProductCard.tsx` (usa `Badge`/`Card` de `shared/components/ui/`)
- [ ] T019 [US1] Implementar `ProductGrid.tsx` em `src/features/produtos/components/ProductGrid.tsx` (depende de T018)
- [ ] T020 [US1] Exportar `ProductGrid`, `ProductCard` em `src/features/produtos/index.ts`
- [ ] T021 [US1] Implementar `src/app/(site)/produtos/page.tsx` (RSC) compondo `ProductGrid` via `getProducts()` (depende de T017, T020)
- [ ] T022 [US1] Tratar estado vazio (nenhum produto ativo) em `ProductGrid.tsx`, sem erro (Edge Case)

**Checkpoint**: User Story 1 funcional e testável de forma independente.

---

## Phase 4: User Story 2 - Filtrar produtos por categoria (Priority: P2)

**Goal**: Visitante filtra a listagem por uma categoria, com opção de voltar a "Todas as categorias".

**Independent Test**: Aplicar filtro de categoria existente e verificar que só produtos daquela categoria permanecem visíveis.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [ ] T023 [P] [US2] Vitest: `getCategories()` e `getProducts({ category_slug })` filtram corretamente, em `src/features/produtos/queries.test.ts`
- [ ] T024 [P] [US2] RTL: `ProductFilters` seleciona categoria, reseta para "Todas", exibe estado vazio sem produtos na categoria, em `src/features/produtos/components/ProductFilters.test.tsx`

### Implementation for User Story 2

- [ ] T025 [US2] Implementar `getCategories()` em `src/features/produtos/queries.ts` (depende de T012)
- [ ] T026 [P] [US2] Implementar `ProductFilters.tsx` (Client) em `src/features/produtos/components/ProductFilters.tsx`
- [ ] T027 [US2] Exportar `ProductFilters` em `src/features/produtos/index.ts`
- [ ] T028 [US2] Atualizar `src/app/(site)/produtos/page.tsx` para ler `searchParams.category`, repassar a `getProducts({ category_slug })` e renderizar `ProductFilters` (depende de T025, T026)
- [ ] T029 [US2] Tratar categoria órfã/excluída selecionada: filtro reseta para "Todas" sem quebrar a página (Edge Case)

**Checkpoint**: User Stories 1 e 2 funcionam juntas e independentemente.

---

## Phase 5: User Story 3 - Navegar do catálogo para o detalhe do produto (Priority: P3)

**Goal**: Cada card é um link para a página de detalhe do produto correspondente.

**Independent Test**: Verificar que cada `ProductCard` aponta para `/produtos/[slug]` correto (a página de destino é validada pela spec 003).

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [ ] T030 [P] [US3] RTL: `ProductCard` renderiza como link (`<a href="/produtos/[slug]">`) apontando para o slug do produto, em `src/features/produtos/components/ProductCard.test.tsx`

### Implementation for User Story 3

- [ ] T031 [US3] Envolver o conteúdo de `ProductCard.tsx` em `next/link` apontando para `/produtos/${slug}` (depende de T018)

**Checkpoint**: Todas as user stories funcionais independentemente.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T032 [P] Validar manualmente os cenários de `specs/001-vitrine-catalogo/quickstart.md` §2.2/§5 referentes ao catálogo público
- [ ] T033 Rodar oxlint em `src/features/produtos/` e `src/app/(site)/produtos/` — zero violações do design system

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — bootstrap do projeto inteiro.
- **Foundational (Phase 2)**: depende de Setup. Bloqueia todas as user stories.
- **User Stories (Phase 3-5)**: dependem de Foundational. US1 é o MVP; US2 e US3 podem seguir em paralelo após US1 (US3 depende apenas de `ProductCard`, já criado em US1).
- **Polish (Phase 6)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T002-T005 (Setup) em paralelo.
- T007-T011 (Foundational) em paralelo.
- T015-T016 (testes US1) em paralelo; T018 (US1) pode ser feito em paralelo a T017.
- T023-T024 (testes US2) em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Completar Fase 3 (US1).
3. Validar US1 isoladamente (catálogo completo, sem filtro).
4. Deploy/demo se pronto.

### Incremental Delivery

1. Setup + Foundational → fundação pronta.
2. US1 → testar independentemente → MVP.
3. US2 → testar independentemente → filtro de categoria.
4. US3 → testar independentemente → navegação para detalhe (depende da spec 003 existir para o destino funcionar de ponta a ponta, mas o link em si é testável isoladamente).

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
