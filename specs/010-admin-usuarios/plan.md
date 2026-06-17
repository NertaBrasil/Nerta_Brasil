# Implementation Plan: Gestão de Usuários Administrativos no Painel

**Branch**: `010-admin-usuarios` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/010-admin-usuarios/spec.md`

## Summary

Tela exclusiva para usuários com papel `admin` criarem novas contas administrativas (admin ou editor) e excluírem contas existentes, sem nenhum mecanismo de autocadastro no sistema. A regra crítica é o bloqueio de autoexclusão, garantido em duas camadas (UI e Server Action). Reaproveita a stack e a arquitetura de pastas definidas em [specs/001-vitrine-catalogo/plan.md](../001-vitrine-catalogo/plan.md); este plano resolve duas decisões específicas desta feature que divergem do esboço inicial em 001 (ver `research.md`): senha definida diretamente pelo admin (em vez de e-mail de redefinição) e o campo `name` no formulário de criação.

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router), `@supabase/ssr`, `@supabase/supabase-js` (Admin API via `service_role`), Zod (schemas), React 18+

**Storage**: PostgreSQL (Supabase) — tabela `admin_profiles` (já definida em `001-vitrine-catalogo/data-model.md`), vinculada a `auth.users` do Supabase Auth.

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `actions.ts` (`createUser`, `deleteUser`, `getAdminUsers`) e o guard de autoexclusão; React Testing Library cobre `UserList`/`DeleteUserModal` apenas onde há lógica condicional (botão de exclusão desabilitado na linha do próprio admin logado).

**Target Platform**: Web, rota `/admin/usuarios`, protegida por sessão Supabase (middleware) + verificação de papel `admin` (não `editor`).

**Project Type**: Web application — módulo do painel admin, dentro da estrutura já definida em 001.

**Performance Goals**: Criação e exclusão completam em uma única interação visível (sem paginação nem etapas intermediárias, dado o volume esperado de poucos usuários administrativos).

**Constraints**:
- Apenas `service_role` (nunca client público) pode chamar a Admin API do Supabase Auth para criar/excluir usuários.
- Bloqueio de autoexclusão deve ser redundante: UI oculta/desabilita a opção E a Server Action rejeita independentemente da origem da requisição (FR-007).
- Sem autocadastro em nenhum ponto do sistema (FR-010) — esta tela é a única porta de entrada de novas contas.
- Apenas papel `admin` acessa esta tela e suas ações; `editor` é rejeitado tanto na UI (rota) quanto no backend (FR-001, FR-008).

**Scale/Scope**: Poucos usuários administrativos (dezenas no máximo) — sem necessidade de paginação, busca ou filtros na listagem.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Feature é 100% admin; não introduz carrinho/checkout/login de cliente final. | ✅ PASS |
| II. Server Component | `UserList` (listagem) é RSC; `UserForm` e `DeleteUserModal` são Client (interação/form). | ✅ PASS |
| III. Design System | Modal de exclusão usa scrim escuro + variante `danger` no botão de confirmação. | ✅ PASS |
| IV. Segurança | `service_role` usado apenas dentro de `actions.ts` admin. Guard de autoexclusão no backend, não só na UI. RLS em `admin_profiles` já coberto por 001. Nenhum autocadastro. | ✅ PASS |
| V. Simplicidade | Sem edição de papel/senha, sem paginação, sem soft-delete — escopo fiel ao spec.md. | ✅ PASS |
| VI. TDD Obrigatório | Testes do guard de autoexclusão e da rejeição de `editor`/não-autenticado escritos e falhando antes da implementação das actions. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/010-admin-usuarios/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — resolve o conflito com o esboço de 001 (senha + nome)
├── data-model.md         # Phase 1 — admin_profiles aplicado a esta feature
├── quickstart.md          # Phase 1 — validação manual ponta a ponta
├── contracts/
│   └── server-actions.md # Assinaturas de createUser, deleteUser, getAdminUsers (revisadas)
└── tasks.md                # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/features/admin/usuarios/
├── components/
│   ├── UserList.tsx        # RSC — tabela de usuários com papel visível
│   ├── UserForm.tsx         # Client — criação de novo usuário (nome, e-mail, senha, papel)
│   └── DeleteUserModal.tsx   # Client — modal de confirmação com scrim escuro
├── actions.ts                 # createUser, deleteUser, getAdminUsers ("use server")
├── schemas.ts                  # Zod: createUserSchema (nome, e-mail válido, senha, papel)
├── types.ts                     # AdminProfile, AdminRole, CreateUserInput (dono único destes tipos)
└── index.ts                      # Barrel — único ponto de entrada consumido por app/(admin)/usuarios/page.tsx
```

**Structure Decision**: Reaproveita a árvore já planejada em `001-vitrine-catalogo/plan.md` (linhas 123–128) para `features/admin/usuarios/`. Nenhuma pasta nova fora do já previsto. `app/(admin)/usuarios/page.tsx` apenas compõe `UserList` e `UserForm` importados do barrel — toda lógica de autorização e mutação vive em `actions.ts`.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
