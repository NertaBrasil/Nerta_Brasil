---

description: "Task list for feature implementation"
---

# Tasks: Autenticação do Painel Administrativo

**Input**: Design documents from `specs/005-admin-autenticacao/` (research.md, contracts/server-actions.md, spec.md, plan.md)

**Prerequisites**: [plan.md](./plan.md), [research.md](./research.md), [contracts/server-actions.md](./contracts/server-actions.md), [spec.md](./spec.md). Assume o scaffolding do projeto (Next.js, Tailwind, Supabase infra, `shared/`) já criado pela [spec 002](../002-catalogo-publico/tasks.md). Esta é a primeira spec a construir infraestrutura administrativa (`middleware.ts`, `features/admin/auth/`, `features/shell/`) — specs subsequentes (006-010) assumem essa fundação já existente.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [ ] T001 [P] Implementar `src/middleware.ts` — confirma apenas existência de sessão válida via `@supabase/ssr` em todas as rotas `/admin/*` exceto `/admin/login`; redireciona para `/admin/login` quando ausente (NUNCA verifica papel aqui, ver `plan.md` Constraints)
- [ ] T002 [P] Implementar `getCurrentAdminProfile()` em `src/features/admin/auth/session.ts` — lê `admin_profiles` pelo usuário da sessão, envolto em `cache()` do React; retorna `null` quando não há sessão OU quando `role` não é `'admin'`/`'editor'` (Edge Case de papel desconhecido, ver `research.md` §4)
- [ ] T003 [P] Criar `src/features/admin/auth/schemas.ts` com `loginSchema` (Zod: e-mail bem formado, senha não vazia)
- [ ] T004 [P] Garantir primitivas `Input`/`Button` em `src/shared/components/ui/` (usadas pelo formulário de login), criando-as se ainda não existirem
- [ ] T005 Criar `src/features/admin/auth/index.ts` (barrel, populado pelas user stories)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Login de usuário administrativo (Priority: P1) 🎯 MVP

**Goal**: Usuário `admin`/`editor` com credenciais válidas acessa a área administrativa; credenciais inválidas exibem mensagem genérica.

**Independent Test**: Com um usuário de seed já cadastrado, submeter credenciais válidas no formulário e verificar acesso concedido; submeter credenciais inválidas e verificar mensagem genérica sem indicar o campo.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [ ] T006 [P] [US1] Vitest: `login()` com credenciais válidas chama `signInWithPassword` e retorna `{ success: true }`; com credenciais inválidas (usuário inexistente OU senha incorreta) retorna sempre `{ success: false, error: "E-mail ou senha inválidos." }` — mesma mensagem para ambas as causas, em `src/features/admin/auth/actions.test.ts`
- [ ] T007 [P] [US1] Vitest: `getCurrentAdminProfile()` retorna `null` quando não há sessão, em `src/features/admin/auth/session.test.ts` (depende de T002)

### Implementation for User Story 1

- [ ] T008 [US1] Implementar `login(input: LoginInput)` em `src/features/admin/auth/actions.ts` (`"use server"`) — valida via `loginSchema`, chama `supabase.auth.signInWithPassword` com client server-side, mapeia qualquer erro para a mensagem genérica única (depende de T003)
- [ ] T009 [US1] Implementar `src/app/(admin)/login/page.tsx` (Client) — formulário e-mail/senha usando `Input`/`Button`, chama `login()`, redireciona para a área administrativa em sucesso, exibe a mensagem genérica em falha
- [ ] T010 [US1] Implementar redirect de FR-008 em `src/app/(admin)/login/page.tsx`: antes de renderizar o formulário, chama `getCurrentAdminProfile()`; se retornar perfil válido, `redirect()` direto para a área administrativa sem exibir o form (depende de T002, T009)
- [ ] T011 [US1] Exportar `login`, `getCurrentAdminProfile` em `src/features/admin/auth/index.ts`

**Checkpoint**: User Story 1 funcional e testável de forma independente.

---

## Phase 3: User Story 2 - Proteção de rotas administrativas (Priority: P1)

**Goal**: Visitante não autenticado nunca vê conteúdo administrativo; é redirecionado para login em qualquer rota `/admin/*`.

**Independent Test**: Sem estar autenticado, acessar diretamente qualquer URL `/admin/*` e verificar redirecionamento para `/admin/login` antes de qualquer conteúdo administrativo aparecer.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [ ] T012 [P] [US2] Teste de integração: `middleware.ts` redireciona para `/admin/login` quando não há sessão em uma rota `/admin/*` protegida, em `src/middleware.test.ts` (depende de T001)
- [ ] T013 [P] [US2] Teste de integração: usuário com sessão válida acessa uma rota `/admin/*` normalmente, sem ser redirecionado pelo `middleware.ts`

### Implementation for User Story 2

- [ ] T014 [US2] Implementar `src/app/(admin)/layout.tsx` (RSC) — chama `getCurrentAdminProfile()`; se `null`, `redirect()` para `/admin/login` (defesa em profundidade além do middleware); monta o Sidebar com os dados do perfil válido (depende de T002)
- [ ] T015 [US2] Configurar o `matcher` de `src/middleware.ts` para cobrir todas as rotas `/admin/*` exceto `/admin/login` (depende de T001)
- [ ] T016 [US2] Tratar Edge Case: conta excluída enquanto a sessão está ativa — `getCurrentAdminProfile()` retorna `null` na próxima verificação em `(admin)/layout.tsx`, forçando o redirect (depende de T014)

**Checkpoint**: User Stories 1 e 2 funcionam juntas — perímetro de segurança mínimo viável completo.

---

## Phase 4: User Story 3 - Logout (Priority: P2)

**Goal**: Usuário autenticado encerra a sessão a qualquer momento e volta a ser tratado como visitante não autenticado.

**Independent Test**: Estando autenticado, acionar logout e verificar que uma tentativa subsequente de acessar rota administrativa redireciona novamente para login.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [ ] T017 [P] [US3] Vitest: `logout()` chama `supabase.auth.signOut()` e retorna `{ success: true }`, em `src/features/shell/actions.test.ts`

### Implementation for User Story 3

- [ ] T018 [US3] Implementar `logout()` em `src/features/shell/actions.ts` (`"use server"`) — já contratada em `001-vitrine-catalogo/contracts/server-actions.md`
- [ ] T019 [US3] Adicionar botão de logout no Sidebar (`src/features/shell/components/Sidebar.tsx`), chamando `logout()` e redirecionando para `/admin/login` em sucesso (depende de T014, T018)
- [ ] T020 [US3] Exportar `logout` em `src/features/shell/index.ts`

**Checkpoint**: Todas as user stories funcionais independentemente — fundação completa para 006-010.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T021 [P] Validar manualmente os cenários de `specs/001-vitrine-catalogo/quickstart.md` referentes a login/logout/proteção de rotas administrativas
- [ ] T022 Rodar oxlint em `src/middleware.ts`, `src/app/(admin)/`, `src/features/admin/auth/`, `src/features/shell/` — zero violações do design system

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende apenas do scaffolding já criado pela spec 002. Bloqueia todas as user stories.
- **User Stories (Phase 2-4)**: US1 e US2 juntas formam o "perímetro de segurança mínimo viável" citado no spec — devem ser tratadas como o MVP real desta feature, embora tecnicamente US1 sozinha já seja testável. US3 (logout) depende de US2 ter o `(admin)/layout.tsx`/Sidebar montados.
- **Polish (Phase 5)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T001-T004 (Foundational) em paralelo.
- T006-T007 (testes US1) em paralelo.
- T012-T013 (testes US2) em paralelo.

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Completar Foundational.
2. Completar Fase 2 (US1) e Fase 3 (US2) — sem ambas, não há painel administrativo seguro utilizável por nenhuma outra spec.
3. Validar US1+US2 juntas (login funcional + proteção de rotas).

### Incremental Delivery

1. Foundational → fundação pronta (middleware, session, auth schemas).
2. US1 → testar independentemente → login funcional.
3. US2 → testar independentemente → perímetro de segurança completo (MVP real desta spec).
4. US3 → testar independentemente → higiene de sessão (logout).

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
- Specs 006-010 assumem `middleware.ts`, `getCurrentAdminProfile()`, `(admin)/layout.tsx` e o Sidebar já existentes a partir desta spec.
