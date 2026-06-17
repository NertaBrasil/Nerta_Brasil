# Implementation Plan: Autenticação do Painel Administrativo

**Branch**: `005-admin-autenticacao` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-admin-autenticacao/spec.md`

## Summary

Login restrito a `admin`/`editor`, proteção de todas as rotas `/admin/*` e logout. É a feature foundacional consumida por todas as demais telas do painel (006–010). Reaproveita a stack e a arquitetura de duas camadas (middleware confirma sessão; `session.ts` resolve papel) já definida em [specs/001-vitrine-catalogo/plan.md](../001-vitrine-catalogo/plan.md). A única peça ainda não contratada em 001 é a própria Server Action de login — resolvida em `research.md` e `contracts/server-actions.md`.

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router, `middleware.ts`), `@supabase/ssr`, Zod (schema do form de login), React 18+

**Storage**: PostgreSQL (Supabase) — leitura de `admin_profiles` (já definida em `001-vitrine-catalogo/data-model.md`) para resolver o papel após autenticação. Nenhuma escrita nesta feature.

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `login()` (credenciais válidas vs. inválidas → sempre mensagem genérica) e `getCurrentAdminProfile()` (retorna `null` sem sessão); testes de integração do `middleware.ts` cobrem o redirect para `/admin/login` em rota protegida sem sessão.

**Target Platform**: Web — `middleware.ts` roda em todas as rotas `/admin/*`; `/admin/login` é a única rota admin pública.

**Project Type**: Web application — feature foundacional do painel admin, dentro da estrutura já definida em 001.

**Performance Goals**: Login bem-sucedido em uma única submissão de formulário (SC-001); logout reflete em no máximo 1 interação (SC-004).

**Constraints**:
- Mensagem de erro de login MUST ser genérica — nunca indicar se o e-mail existe ou se a senha está incorreta (FR-004, SC-003).
- `middleware.ts` (Edge) MUST verificar apenas a existência de sessão válida, nunca o papel — checagem de papel em Edge exigiria round-trip de banco em toda request (convenção já fixada em 001, "Code Architecture Conventions" §4).
- `getCurrentAdminProfile()` MUST ser a única fonte de verdade para o papel, envolvida em `cache()` do React para deduplicar a consulta por request.
- Usuário já autenticado que acessa `/admin/login` MUST ser redirecionado direto à área administrativa, sem ver o formulário (FR-008).

**Scale/Scope**: Poucos usuários administrativos; sem rate limiting avançado nesta versão (Assumptions do spec — extensão futura).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Autenticação existe apenas em `/admin/*`; usuário final da vitrine nunca loga. | ✅ PASS |
| II. Server Component | Tela de login é Client (formulário); `(admin)/layout.tsx` é RSC, só lê a sessão para montar o Sidebar. | ✅ PASS |
| III. Design System | Formulário de login usa componentes/tokens existentes (`Input`, `Button`). | ✅ PASS |
| IV. Segurança | `service_role` não é necessário nesta feature (login usa o client `anon` via `@supabase/ssr`, que já resolve a sessão por cookie). Papel nunca lido de `user_metadata`. | ✅ PASS |
| V. Simplicidade | Sem "esqueci minha senha" nem rate limiting avançado nesta versão (Assumptions). | ✅ PASS |
| VI. TDD Obrigatório | Testes de `login()` (mensagem genérica) e do guard de middleware escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/005-admin-autenticacao/
├── plan.md       # Este arquivo
├── research.md    # Decisão sobre o mecanismo de login (Server Action vs. client direto)
├── contracts/
│   └── server-actions.md # Assinatura de login() — único contrato novo desta feature
└── tasks.md         # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── middleware.ts                          # Já previsto em 001 — confirma sessão válida em /admin/*
├── app/(admin)/
│   ├── layout.tsx                          # RSC — chama getCurrentAdminProfile() para montar o Sidebar
│   └── login/
│       └── page.tsx                        # Client — formulário; redireciona se já autenticado
└── features/admin/auth/
    ├── session.ts                            # getCurrentAdminProfile() — já contratada em 001, cache()
    ├── actions.ts                              # login(input) — único contrato novo ("use server")
    ├── schemas.ts                               # Zod: loginSchema (e-mail, senha)
    └── index.ts                                  # Barrel já previsto em 001
```

**Structure Decision**: Nenhuma pasta nova fora do já previsto em `features/admin/auth/` (001, linhas 104–106). `login()` é adicionado a `actions.ts` dentro dessa mesma feature, ao lado de `session.ts`, já que ambos pertencem ao domínio de autenticação.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
