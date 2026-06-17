---

description: "Task list for feature implementation"
---

# Tasks: Gestão de Usuários Administrativos no Painel

**Input**: Design documents from `specs/010-admin-usuarios/`

**Prerequisites**: [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/server-actions.md](./contracts/server-actions.md), [quickstart.md](./quickstart.md), [spec.md](./spec.md). Assume o scaffolding (002) e a fundação administrativa (005, especialmente `getCurrentAdminProfile()` e `middleware.ts`) já existentes. Esta é a última spec da fundação administrativa — não introduz schema novo (reaproveita `admin_profiles` de 001), mas usa a Admin API do Supabase Auth (`service_role`) por trabalhar diretamente com `auth.users`.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T001 [P] Criar `types.ts` em `src/features/admin/usuarios/types.ts` com `AdminRole`, `AdminProfile`, `CreateUserInput` (dono único destes tipos, revisão de 001 ganhando `password`/`email`)
- [ ] T002 [P] Criar `createUserSchema` (Zod) em `src/features/admin/usuarios/schemas.ts` — `name`, `email` válido, `password` com tamanho mínimo, `role` dentre `'admin' | 'editor'`
- [ ] T003 Implementar `getAdminUsers()` em `src/features/admin/usuarios/actions.ts` — verifica `role === 'admin'` do usuário atual, lê `admin_profiles` com e-mail resolvido de `auth.users`, ordenado por `name ASC`, retorna `ActionResult<AdminProfile[]>` (depende de T001)
- [ ] T004 Implementar `UserList.tsx` (RSC) em `src/features/admin/usuarios/components/UserList.tsx` — tabela de usuários com papel visível, consumindo `getAdminUsers()` (depende de T003)
- [ ] T005 Criar `app/(admin)/usuarios/page.tsx` (RSC) compondo `UserList` — rota acessível apenas a `role === 'admin'` (depende de T004)
- [ ] T006 Exportar `getAdminUsers`, `UserList` em `src/features/admin/usuarios/index.ts`

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Criar um novo usuário administrativo (Priority: P1) 🎯 MVP

**Goal**: Usuário com papel 'admin' cria uma nova conta administrativa (nome, e-mail, senha, papel), que passa a poder fazer login.

**Independent Test**: Autenticado como um usuário 'admin' de seed, preencher o formulário de novo usuário, e verificar que a conta criada aparece na listagem e consegue fazer login com as credenciais definidas.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [ ] T007 [P] [US1] Vitest: `createUser` rejeita quando o usuário atual não tem `role === 'admin'` (inclui `role === 'editor'` e não autenticado), em `src/features/admin/usuarios/actions.test.ts`
- [ ] T008 [P] [US1] Vitest: `createUser` insere em `auth.users` (Admin API) e em `admin_profiles` com os dados informados, retornando `AdminProfile` completo incluindo `email` (Acceptance Scenario 1)
- [ ] T009 [P] [US1] Vitest: `createUser` mapeia erro de e-mail duplicado da Admin API para mensagem de duplicidade, sem inserir em `admin_profiles` (FR-003, Acceptance Scenario 2)
- [ ] T010 [P] [US1] Vitest: `createUser` desfaz a criação em `auth.users` (`auth.admin.deleteUser`) se a inserção em `admin_profiles` falhar (rollback manual, `data-model.md`)
- [ ] T011 [P] [US1] Vitest: `createUserSchema` rejeita e-mail com formato inválido (FR-004), em `src/features/admin/usuarios/schemas.test.ts`
- [ ] T012 [P] [US1] RTL: rota `/admin/usuarios` nega acesso a um usuário com papel 'editor' (Acceptance Scenario 3), em `src/app/(admin)/usuarios/page.test.tsx`

### Implementation for User Story 1

- [ ] T013 [US1] Implementar `createUser(input)` em `src/features/admin/usuarios/actions.ts` — verifica papel 'admin', valida via `createUserSchema`, chama `auth.admin.createUser()`, insere em `admin_profiles` com rollback em caso de falha (depende de T001, T002)
- [ ] T014 [US1] Implementar `UserForm.tsx` (Client) em `src/features/admin/usuarios/components/UserForm.tsx` — campos nome/e-mail/senha/papel, chama `createUser()`, exibe erro de duplicidade e de validação de e-mail
- [ ] T015 [US1] Integrar `UserForm` em `app/(admin)/usuarios/page.tsx` (depende de T005, T014)
- [ ] T016 [US1] Exportar `createUser`, `UserForm` em `src/features/admin/usuarios/index.ts`

**Checkpoint**: User Story 1 funcional e testável de forma independente — MVP da feature (única porta de entrada de novas contas, FR-010).

---

## Phase 3: User Story 2 - Excluir um usuário administrativo existente (Priority: P1)

**Goal**: Usuário com papel 'admin' exclui permanentemente a conta de outro usuário administrativo, removendo seu acesso ao painel.

**Independent Test**: Autenticado como um usuário 'admin' de seed, excluir outro usuário de teste, e verificar que a conta excluída não consegue mais fazer login.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [ ] T017 [P] [US2] Vitest: `deleteUser` rejeita quando o usuário atual não tem `role === 'admin'`, em `src/features/admin/usuarios/actions.test.ts`
- [ ] T018 [P] [US2] Vitest: `deleteUser` chama `auth.admin.deleteUser(id)` para um usuário diferente do atual, e a linha em `admin_profiles` é removida via cascade (Acceptance Scenario 1)
- [ ] T019 [P] [US2] RTL: acionar a exclusão em `DeleteUserModal` exibe scrim escuro e exige confirmação explícita antes de chamar `deleteUser()` (Acceptance Scenario 2, FR-006), em `src/features/admin/usuarios/components/DeleteUserModal.test.tsx`

### Implementation for User Story 2

- [ ] T020 [US2] Implementar `deleteUser(id)` em `src/features/admin/usuarios/actions.ts` — verifica papel 'admin', chama `auth.admin.deleteUser(id)` (depende de T001)
- [ ] T021 [US2] Implementar `DeleteUserModal.tsx` (Client) em `src/features/admin/usuarios/components/DeleteUserModal.tsx` — scrim escuro, confirmação explícita, chama `deleteUser()` (depende de T020)
- [ ] T022 [US2] Integrar `DeleteUserModal` em `UserList.tsx` (ação de exclusão por linha) (depende de T004, T021)
- [ ] T023 [US2] Exportar `deleteUser`, `DeleteUserModal` em `src/features/admin/usuarios/index.ts`

**Checkpoint**: User Stories 1 e 2 funcionam juntas — ciclo básico de gestão de acesso completo.

---

## Phase 4: User Story 3 - Bloqueio de autoexclusão (Priority: P1)

**Goal**: Um usuário 'admin' é impedido de excluir a própria conta, tanto na interface quanto no backend, independentemente da origem da requisição.

**Independent Test**: Autenticado como um usuário 'admin', tentar excluir a própria conta diretamente (inclusive contornando a interface), e verificar que a operação é sempre bloqueada.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [ ] T024 [P] [US3] Vitest: `deleteUser(id)` rejeita quando `id` é igual ao `id` do usuário atual, retornando erro claro e sem chamar a Admin API (Acceptance Scenario 2, FR-007, SC-001), em `src/features/admin/usuarios/actions.test.ts`
- [ ] T025 [P] [US3] RTL: a ação de exclusão fica indisponível/bloqueada na linha do próprio admin logado em `UserList`/`DeleteUserModal` (Acceptance Scenario 1), em `src/features/admin/usuarios/components/UserList.test.tsx`

### Implementation for User Story 3

- [ ] T026 [US3] Adicionar o guard de autoexclusão em `deleteUser()` — compara `id` com `(await getCurrentAdminProfile())!.id` antes de qualquer chamada à Admin API, retornando erro dedicado (depende de T020)
- [ ] T027 [US3] Desabilitar/ocultar a ação de exclusão na linha correspondente ao admin logado em `UserList.tsx` (depende de T004, T022)

**Checkpoint**: Todas as user stories funcionais independentemente — regra crítica de bloqueio de autoexclusão garantida em duas camadas.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T028 [P] Validar manualmente os cenários de `quickstart.md` desta spec
- [ ] T029 Rodar oxlint em `src/features/admin/usuarios/components/UserForm.tsx`, `UserList.tsx`, `DeleteUserModal.tsx` — zero violações do design system
- [ ] T030 Confirmar Edge Case: sessão de um usuário excluído é negada na próxima verificação de papel (`getCurrentAdminProfile()` retorna `null` após o perfil ser removido via cascade), mesmo com token ainda válido (SC-004)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende do scaffolding (002) e da fundação administrativa (005, `getCurrentAdminProfile()`/`middleware.ts`). Bloqueia todas as user stories.
- **User Stories (Phase 2-4)**: US1 é o MVP (sem criação, nenhuma conta nova entra no sistema — FR-010); US2 é o complemento direto de US1 e reaproveita `UserList`/`DeleteUserModal`; US3 depende de US2 ter `deleteUser()` e `DeleteUserModal` implementados, adicionando o guard crítico sobre a mesma função.
- **Polish (Phase 5)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T001-T002 (Foundational, arquivos diferentes) em paralelo.
- T007-T012 (testes US1) em paralelo.
- T017-T019 (testes US2) em paralelo.
- T024-T025 (testes US3) em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Foundational.
2. Completar Fase 2 (US1) — criação funcional, única porta de entrada de contas.
3. Validar US1 isoladamente.

### Incremental Delivery

1. Foundational → listagem visível, sem mutações ainda.
2. US1 → testar independentemente → criação funcional (MVP).
3. US2 → testar independentemente → exclusão de outros usuários funcional.
4. US3 → testar independentemente → bloqueio de autoexclusão garantido em UI + backend.

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
- `deleteUser` é uma única função; T020 (US2) implementa a exclusão básica e T026 (US3) adiciona o guard de autoexclusão sobre a mesma função, não uma função separada.
- Esta é a última spec da fundação administrativa (002-010) — não há spec subsequente que dependa dela.
