---

description: "Task list for feature implementation"
---

# Tasks: Home / Landing Institucional

**Input**: Design documents from `specs/004-home-landing/` (plano fino — reaproveita stack/contratos de `specs/001-vitrine-catalogo/`)

**Prerequisites**: [plan.md](./plan.md), [research.md](./research.md), [spec.md](./spec.md). Sem `data-model.md`/`contracts/` próprios — consultar os equivalentes em `specs/001-vitrine-catalogo/`. Assume o scaffolding do projeto e o `ProductCard` já criados pela [spec 002](../002-catalogo-publico/tasks.md) — sem Fase 1 (Setup) própria.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T001 Implementar `getFeaturedProducts()` em `src/features/produtos/queries.ts` — filtra `active = true AND featured = true`; ordena pela ordem já retornada pela query (sem lógica de ordenação própria desta feature, ver `research.md`)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Conhecer a marca e ser direcionado ao catálogo (Priority: P1) 🎯 MVP

**Goal**: Visitante vê a seção institucional e tem um caminho claro (CTA) até o catálogo completo, independentemente de existirem produtos em destaque.

**Independent Test**: Acessar a home e verificar que a seção institucional está presente e que existe um link/botão que leva a `/produtos`.

### Implementation for User Story 1

- [ ] T002 [US1] Criar `InstitutionalSection` (RSC, componente local) em `src/app/(site)/page.tsx` com o texto/imagens curtos sobre a marca (conteúdo estático, FR-001)
- [ ] T003 [US1] Adicionar CTA em `src/app/(site)/page.tsx` que direciona via `next/link` para `/produtos` (FR-002, SC-002)
- [ ] T004 [US1] Garantir ausência de qualquer elemento de carrinho, checkout ou login de usuário final na home (FR-007)

**Checkpoint**: User Story 1 funcional e testável de forma independente — home funciona como ponto de entrada autônomo mesmo sem destaques.

---

## Phase 3: User Story 2 - Ver produtos em destaque na home (Priority: P2)

**Goal**: Visitante vê, na home, os produtos `active = true AND featured = true`, cada um navegável para sua página de detalhe; ausência de destaques não gera erro.

**Independent Test**: Com produtos de seed (destaque ativo, destaque inativo, nenhum destaque), verificar que a seção mostra apenas os elegíveis ou exibe estado neutro quando vazia.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [ ] T005 [P] [US2] Vitest: `getFeaturedProducts()` retorna apenas produtos com `active = true AND featured = true`, excluindo destaque inativo, em `src/features/produtos/queries.test.ts` (depende de T001)
- [ ] T006 [P] [US2] RTL: `FeaturedSection` renderiza grid quando há produtos e estado neutro (sem erro) quando a lista é vazia, em `src/features/produtos/components/FeaturedSection.test.tsx`

### Implementation for User Story 2

- [ ] T007 [US2] Implementar `FeaturedSection.tsx` (RSC) em `src/features/produtos/components/FeaturedSection.tsx` — reaproveita `ProductCard` (já linkado para `/produtos/[slug]` desde a spec 002); omite a seção ou exibe estado neutro quando a lista é vazia (FR-005)
- [ ] T008 [US2] Exportar `FeaturedSection` em `src/features/produtos/index.ts`
- [ ] T009 [US2] Integrar `FeaturedSection` em `src/app/(site)/page.tsx`, chamando `getFeaturedProducts()` (depende de T001, T007)

**Checkpoint**: Todas as user stories funcionais independentemente.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [ ] T010 [P] Validar manualmente os cenários de `specs/001-vitrine-catalogo/quickstart.md` referentes à home (seção institucional, CTA, destaques)
- [ ] T011 Rodar oxlint em `src/app/(site)/page.tsx` e `src/features/produtos/components/FeaturedSection.tsx` — zero violações do design system

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende apenas do scaffolding já criado pela spec 002. Bloqueia US2 (US1 não depende de `getFeaturedProducts()`).
- **User Stories (Phase 2-3)**: US1 é o MVP e não depende de produtos em destaque existirem; US2 depende de Foundational (T001) mas é independente de US1 em termos de implementação (seções distintas da mesma página).
- **Polish (Phase 4)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T002-T004 (US1) podem ser feitos em paralelo a T005-T009 (US2), por serem seções distintas da mesma página.
- T005-T006 (testes US2) em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Foundational.
2. Completar Fase 2 (US1) — home funcional com institucional + CTA, sem seção de destaques.
3. Validar US1 isoladamente.

### Incremental Delivery

1. Foundational → fundação pronta.
2. US1 → testar independentemente → MVP (home funcional como ponto de entrada).
3. US2 → testar independentemente → seção de destaques agregada.

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
- Se a spec 009 (admin-destaques) já tiver introduzido `featured_position`, `getFeaturedProducts()` (T001) deve ordenar por essa coluna internamente — sem impacto nesta lista de tasks (ver nota de dependência em `research.md`).
