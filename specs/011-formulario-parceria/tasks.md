---

description: "Task list for feature implementation"
---

# Tasks: Formulário de Parceria + Modo de Compra por Produto

**Input**: Design documents from `specs/011-formulario-parceria/` (research.md, data-model.md, contracts/types.ts, contracts/server-actions.md, quickstart.md, spec.md)

**Prerequisites**: [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/server-actions.md](./contracts/server-actions.md), [contracts/types.ts](./contracts/types.ts), [quickstart.md](./quickstart.md), [spec.md](./spec.md). Assume o scaffolding (002), a vitrine pública e `BuyButton` (003), a fundação administrativa (005) e o CRUD de produtos (007, especialmente `ProductForm.tsx`/`schemas.ts`) já existentes. Branch empilhada sobre `feature/009-admin-destaques` (006→007→008→009), por reaproveitar diretamente `ProductForm`/`schemas.ts`/`actions.ts` de `features/admin/products`, em vez de recriá-los.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T001 Criar migração de schema adicionando `products.purchase_mode text NOT NULL DEFAULT 'mercado_livre' CHECK (purchase_mode IN ('mercado_livre', 'formulario_parceria'))` em `db/migrations/0004_products_purchase_mode.{up,down}.sql`, validar localmente (UP/DOWN/UP), replicar via `supabase migration new` e `supabase db reset`, registrar em `db/controle/MIGRATIONS.md` (ver `data-model.md`)
- [ ] T002 Criar migração de schema para a nova tabela `partner_applications` (todas as colunas de `data-model.md`, FK `product_id` → `products.id` ON DELETE SET NULL) + RLS (INSERT público via `anon`/`authenticated`, SELECT apenas `authenticated`, sem UPDATE/DELETE para nenhuma role) + GRANT necessário para a Data API, em `db/migrations/0005_partner_applications.{up,down}.sql`, mesmo processo de validação de T001
- [ ] T003 [P] Adicionar `purchase_mode: PurchaseMode` a `Product`/`ProductSummary` em `src/features/products/types.ts` (dono único, `PurchaseMode = "mercado_livre" | "formulario_parceria"`)
- [ ] T004 [P] Criar `src/features/partner-applications/types.ts` com `PartnerApplication`, `PartnerApplicationSummary`, `SubmitPartnerApplicationInput` e os enums de domínio (`DocumentType`, `RelationshipInterest`, `MarketSegment`, `YearsInMarket`, `EmployeeCount`, `MainChallenge`, `SupplierPriority`, `GeographicScope`, `InitialPurchasePotential`, `PioneerPartnersInterest`) — conforme `contracts/types.ts`
- [ ] T005 Atualizar `PRODUCT_CARD_SELECT`/`PRODUCT_DETAIL_SELECT` em `src/features/products/queries.ts` para incluir `purchase_mode` (sem mudança de assinatura de `getProductBySlug`/`getProducts`)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Admin define o modo de compra do produto (Priority: P1) 🎯 MVP

**Goal**: Admin cadastra/edita um produto escolhendo o modo de compra ("Link Mercado Livre" ou "Formulário de Parceria"), persistido e recuperado corretamente por produto.

**Independent Test**: Cadastrar dois produtos com modos diferentes e confirmar que cada um é salvo/recuperado com o modo correto, mesmo sem o formulário público existir ainda.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [ ] T006 [P] [US1] Vitest: `createProduct`/`updateProduct` persistem `purchase_mode` informado, em `src/features/admin/products/actions.test.ts`
- [ ] T007 [P] [US1] Vitest: `productSchema` exige `ml_url` apenas quando `purchase_mode === 'mercado_livre'` (não exige quando `'formulario_parceria'`), em `src/features/admin/products/schemas.test.ts`
- [ ] T008 [P] [US1] Vitest: produto sem `purchase_mode` informado assume `'mercado_livre'` como padrão na leitura (FR-002), em `src/features/products/queries.test.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Estender `productSchema`/`updateProductSchema` em `src/features/admin/products/schemas.ts` com `purchase_mode: z.enum(["mercado_livre", "formulario_parceria"])` e tornar `ml_url` condicionalmente obrigatório via `.refine()` (depende de T003)
- [ ] T010 [US1] Estender `createProduct`/`updateProduct` em `src/features/admin/products/actions.ts` para persistir `purchase_mode` (depende de T009)
- [ ] T011 [US1] Adicionar campo "Modo de compra" (`Select`) em `ProductForm.tsx` (`src/features/admin/products/components/ProductForm.tsx`) — ao escolher "Formulário de Parceria", oculta/desobriga o campo `ml_url` (depende de T010)
- [ ] T012 [US1] Atualizar `toProduct()`/mapeamentos de linha em `src/features/admin/products/actions.ts` e `src/features/products/queries.ts` para incluir `purchase_mode` no retorno (depende de T005)

**Checkpoint**: User Story 1 funcional e testável de forma independente.

---

## Phase 3: User Story 2 - Visitante preenche e envia o Formulário de Parceria (Priority: P1)

**Goal**: Em produtos com modo "Formulário de Parceria", o botão de compra leva ao formulário multi-etapas (identificação PJ/CNPJ ou PF/CPF + demais etapas); ao enviar, a submissão é registrada vinculada ao produto.

**Independent Test**: Acessar a página de um produto em modo formulário, preencher e enviar nos dois caminhos (PJ e PF), confirmando sucesso em ambos.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [X] T013 [P] [US2] Vitest: validação de checksum de CPF (módulo 11) aceita CPFs válidos e rejeita inválidos (dígitos repetidos, checksum incorreto, tamanho incorreto), em `src/features/partner-applications/document-validation.test.ts`
- [X] T014 [P] [US2] Vitest: validação de checksum de CNPJ (módulo 11) aceita CNPJs válidos e rejeita inválidos, no mesmo arquivo de T013
- [X] T015 [P] [US2] Vitest: `partnerApplicationSchema` exige `legal_name` como "Nome Completo" e rejeita CNPJ quando `document_type = 'cpf'` (FR-007), em `src/features/partner-applications/schemas.test.ts`
- [X] T016 [P] [US2] Vitest: `partnerApplicationSchema` mantém `trade_name` disponível e valida `document_number` como CNPJ quando `document_type = 'cnpj'` (FR-008), no mesmo arquivo
- [X] T017 [P] [US2] Vitest: `partnerApplicationSchema` rejeita documento em formato/checksum inválido independentemente do tipo (FR-009), no mesmo arquivo
- [X] T018 [P] [US2] Vitest: `submitPartnerApplication` insere a submissão com `product_name_snapshot` resolvido a partir de `product_id`, sem checagem de sessão (visitante anônimo), em `src/features/partner-applications/actions.test.ts`
- [X] T019 [P] [US2] Vitest: `submitPartnerApplication` retorna erro de validação (sem inserir) quando o documento informado é inválido, no mesmo arquivo
- [X] T020 [P] [US2] RTL: `BuyButton` navega internamente (sem `target="_blank"`) para `/produtos/[slug]/parceria` quando `purchase_mode = 'formulario_parceria'`, independentemente de `stock`, e preserva o comportamento atual (link ML + analytics) quando `purchase_mode = 'mercado_livre'`, em `src/features/products/components/BuyButton.test.tsx`
- [X] T021 [P] [US2] RTL: `PartnerApplicationForm` troca os campos da etapa de identificação ao alternar entre Pessoa Jurídica e Pessoa Física (Acceptance Scenarios 2-3), em `src/features/partner-applications/components/PartnerApplicationForm.test.tsx`
- [X] T022 [P] [US2] RTL: `PartnerApplicationForm` bloqueia o envio (não chama `submitPartnerApplication`) quando o documento informado é inválido, exibindo o campo a corrigir (Acceptance Scenario 5), no mesmo arquivo
- [X] T023 [P] [US2] RTL: `PartnerApplicationForm` chama `submitPartnerApplication` com o payload completo e exibe confirmação de envio ao concluir todas as etapas (Acceptance Scenario 4), no mesmo arquivo

### Implementation for User Story 2

- [X] T024 [US2] Implementar `cpf.ts`/`cnpj.ts` (ou `document-validation.ts` único) com os algoritmos de checksum módulo 11 em `src/features/partner-applications/` (depende de T013, T014)
- [X] T025 [US2] Implementar `partnerApplicationSchema` (Zod) em `src/features/partner-applications/schemas.ts` — schema único client/server, com `.refine()` usando os validadores de T024, e branching condicional PJ/PF (depende de T004, T024)
- [X] T026 [US2] Implementar `submitPartnerApplication(input)` em `src/features/partner-applications/actions.ts` — usa `infrastructure/supabase/server.ts` (client de sessão padrão, sem `service_role`), resolve `product_name_snapshot`, insere em `partner_applications`, não dispara analytics (FR-011) (depende de T002, T025)
- [X] T027 [US2] Atualizar `BuyButton.tsx` (`src/features/products/components/BuyButton.tsx`) para ramificar por `purchase_mode`: link ML (comportamento atual) ou `<Link href="/produtos/[slug]/parceria">` interno, sem analytics (depende de T003)
- [X] T028 [US2] Implementar `PartnerApplicationForm.tsx` (Client, único Client Component da rota) em `src/features/partner-applications/components/PartnerApplicationForm.tsx` — estado das 7 etapas via `useState`/`useReducer`, toggle PJ/PF na etapa de identificação, validação por etapa reaproveitando `partnerApplicationSchema`, chama `submitPartnerApplication()` ao concluir (depende de T025, T026)
- [X] T029 [US2] Criar `app/(public)/produtos/[slug]/parceria/page.tsx` (RSC) — busca o produto via `getProductBySlug` (404 se inexistente/inativo, mesma regra da spec 003), passa `product_id`/nome para `PartnerApplicationForm` (depende de T027, T028)
- [X] T030 [US2] Exportar `submitPartnerApplication`, `PartnerApplicationForm` e os tipos em `src/features/partner-applications/index.ts`

**Checkpoint**: User Stories 1 e 2 funcionam juntas — fluxo completo do visitante, ponta a ponta.

---

## Phase 4: User Story 3 - Admin consulta as respostas recebidas (Priority: P2)

**Goal**: Admin/editor autenticado vê a lista de submissões (mais recentes primeiro) e o detalhe completo de cada uma, incluindo o produto de origem.

**Independent Test**: Autenticado como admin/editor, acessar a seção, ver submissões de teste listadas e abrir o detalhe de uma delas.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [X] T031 [P] [US3] Vitest: `getPartnerApplications` rejeita quando o usuário atual não é admin/editor (FR-012), em `src/features/admin/partner-applications/actions.test.ts`
- [X] T032 [P] [US3] Vitest: `getPartnerApplications` retorna a lista ordenada por `created_at DESC` (FR-013), no mesmo arquivo
- [X] T033 [P] [US3] Vitest: `getPartnerApplicationById` retorna a submissão completa com o produto de origem, e erro claro quando o `id` não existe, no mesmo arquivo

### Implementation for User Story 3

- [X] T034 [US3] Implementar `getPartnerApplications()` e `getPartnerApplicationById(id)` em `src/features/admin/partner-applications/actions.ts` — exige `role IN ('admin', 'editor')` via `getCurrentAdminProfile()` (depende de T002, T004)
- [X] T035 [US3] Implementar `PartnerApplicationList.tsx` (RSC) em `src/features/admin/partner-applications/components/PartnerApplicationList.tsx` — tabela com `legal_name`, `document_type`, `product_name_snapshot`, `relationship_interest`, `created_at`, link para o detalhe (depende de T034)
- [X] T036 [US3] Implementar `PartnerApplicationDetail.tsx` (RSC) em `src/features/admin/partner-applications/components/PartnerApplicationDetail.tsx` — exibe todos os campos preenchidos e o produto de origem (depende de T034)
- [X] T037 [US3] Criar `app/admin/(protected)/parcerias/page.tsx` (RSC, compõe `PartnerApplicationList`) e `app/admin/(protected)/parcerias/[id]/page.tsx` (RSC, compõe `PartnerApplicationDetail`, `notFound()` se `id` inexistente) (depende de T035, T036)
- [X] T038 [US3] Adicionar link "Parcerias" ao Sidebar (`src/features/shell/components/Sidebar.tsx`), visível para admin e editor
- [X] T039 [US3] Exportar `getPartnerApplications`, `getPartnerApplicationById`, `PartnerApplicationList`, `PartnerApplicationDetail` em `src/features/admin/partner-applications/index.ts`

**Checkpoint**: Todas as user stories funcionais independentemente — ciclo completo (configurar → preencher → consultar).

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T040 [P] Validar manualmente os cenários de `quickstart.md` desta spec — Cenários 1-5 cobertos por suite automatizada (ProductForm, BuyButton, PartnerApplicationForm, document-validation, admin/partner-applications actions); Cenário 6 (acesso negado) decorre da arquitetura existente (`app/admin/(protected)/layout.tsx` já redireciona para `/admin/login` quando `getCurrentAdminProfile()` retorna `null`, e `/admin/parcerias` está nesse group). Validação em navegador real fica para a rodada de testes e2e solicitada ao final de todas as specs.
- [X] T041 Rodar oxlint em `src/features/partner-applications/`, `src/features/admin/partner-applications/`, `ProductForm.tsx`, `BuyButton.tsx` — zero violações do design system (confirmado: `npx oxlint src` → 0 warnings, 0 errors)
- [X] T042 Confirmar Edge Case: produto com submissões vinculadas, ao ser excluído (`deleteProduct`, spec 007), libera `partner_applications.product_id` para `NULL` via `ON DELETE SET NULL`, preservando `product_name_snapshot`, sem bloquear a exclusão (FR não exige bloqueio — ver `research.md` §5) — confirmado em `db/migrations/0005_partner_applications.up.sql:8` (`product_id uuid references products(id) on delete set null`)
- [X] T043 Confirmar Edge Case: alterar `purchase_mode` de um produto após já existirem submissões não afeta as submissões já registradas (sem lógica adicional — `partner_applications` não referencia `purchase_mode`) — confirmado: nenhuma coluna/constraint de `partner_applications` referencia `products.purchase_mode`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende do scaffolding (002), vitrine pública/`BuyButton` (003), fundação administrativa (005) e CRUD de produtos (007). Inclui as duas migrações de schema desta feature (T001, T002). Bloqueia todas as user stories.
- **User Stories (Phase 2-4)**: US1 é pré-requisito real de US2 (o botão só ramifica para o formulário se houver `purchase_mode` configurável), mas é testável isoladamente sem o formulário existir. US2 é o MVP de entrega de valor visível ao visitante. US3 depende logicamente de existirem submissões (resultado de US2) para ter algo a exibir, mas sua implementação (queries/actions/UI) não depende tecnicamente de US2 estar pronta — apenas da tabela de T002.
- **Polish (Phase 5)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T003-T005 (Foundational, arquivos diferentes) majoritariamente em paralelo (T005 depende de T003).
- T006-T008 (testes US1) em paralelo.
- T013-T023 (testes US2) em paralelo entre si.
- T031-T033 (testes US3) em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Completar Foundational (inclui as duas migrações).
2. Completar Fase 2 (US1) — modo de compra configurável.
3. Completar Fase 3 (US2) — formulário público funcional ponta a ponta.
4. Validar US1+US2 isoladamente (a feature já entrega valor de negócio nesse ponto).

### Incremental Delivery

1. Foundational → schema pronto (`purchase_mode`, `partner_applications`).
2. US1 → testar independentemente → modo de compra configurável no admin.
3. US2 → testar independentemente → visitante preenche e envia o formulário (MVP de valor).
4. US3 → testar independentemente → admin consulta submissões recebidas.

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
- Branch desta spec (`feature/011-formulario-parceria`) empilha sobre `feature/009-admin-destaques` (topo da cadeia 006→007→008→009), por reaproveitar `ProductForm`/`schemas.ts`/`actions.ts` de `features/admin/products` diretamente, em vez de recriá-los como peças genéricas (diferente da spec 010, que era independente dessas branches).
- `submitPartnerApplication` é a única Server Action pública desta spec sem checagem de `getCurrentAdminProfile()` — visitante é anônimo por design (FR não exige autenticação para enviar o formulário).
- Não há `updatePartnerApplication`/`deletePartnerApplication` em nenhuma task — ausência intencional (FR-015).
