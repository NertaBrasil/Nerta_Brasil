# Implementation Plan: Gestão de Categorias no Painel Administrativo

**Branch**: `006-admin-categorias` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-admin-categorias/spec.md`

## Summary

CRUD de categorias (criar, editar, excluir) restrito a usuários autenticados (`admin`/`editor`), com geração automática de slug a partir do nome e bloqueio de exclusão quando há produtos vinculados. Reaproveita integralmente a stack, o modelo de dados (`categories`) e os contratos `createCategory`/`updateCategory`/`deleteCategory` já definidos em [specs/001-vitrine-catalogo/plan.md](../001-vitrine-catalogo/plan.md). Esta feature não introduz nenhuma entidade, contrato ou decisão técnica nova — por isso não há `research.md`, `data-model.md`, `contracts/` ou `quickstart.md` próprios; consulte os equivalentes em [001-vitrine-catalogo/data-model.md](../001-vitrine-catalogo/data-model.md) e [001-vitrine-catalogo/contracts/server-actions.md](../001-vitrine-catalogo/contracts/server-actions.md#server-actions--admin-categorias-featuresadmincategoriasactionsts).

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router), Tailwind CSS, React 18+, Zod (validação de `categorySchema`)

**Storage**: PostgreSQL (Supabase) — leitura e escrita em `categories`, já definida em `001-vitrine-catalogo/data-model.md`. `deleteCategory` verifica vínculo com `products` (FK `category_id`) antes de excluir.

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `createCategory`/`updateCategory` (geração de slug a partir do nome, rejeição de nome/slug duplicado) e `deleteCategory` (bloqueio quando há produtos vinculados, sucesso quando não há); React Testing Library cobre `CategoryForm` (edição manual do slug sugerido) e `DeleteCategoryModal` (scrim escuro, mensagem de bloqueio).

**Target Platform**: Web, rotas `/admin/categorias`, protegidas por `middleware.ts` (spec 005-admin-autenticacao, pré-requisito).

**Project Type**: Web application — tela do painel administrativo, dentro da estrutura já definida em 001.

**Performance Goals**: Listagem completa de categorias visível em até 2s (SC-004); criação válida em 1 submissão de formulário na maioria dos casos (SC-001).

**Constraints**:
- Slug é gerado automaticamente a partir do nome, mas editável antes de salvar (FR-002).
- Nome e slug duplicados (entre categorias diferentes) MUST ser rejeitados antes de persistir qualquer alteração (FR-003, SC-003).
- Exclusão de categoria com produtos vinculados MUST ser bloqueada sem exceção (FR-007, SC-002) — verificação ocorre no Server Action, antes do `DELETE`, e não depende do comportamento `ON DELETE SET NULL` da FK (defesa em profundidade documentada em `001-vitrine-catalogo/data-model.md`).
- Toda exclusão exige confirmação via modal com scrim escuro (FR-006, Princípio III).

**Scale/Scope**: Lista plana de categorias, sem hierarquia/subcategorias (Assumptions do spec).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Gestão de categorias é exclusivamente administrativa; não introduz carrinho, checkout ou login de usuário final. | ✅ PASS |
| II. Server Component | Listagem (`CategoryList`) é RSC; `CategoryForm` e `DeleteCategoryModal` são Client (formulário e modal interativos). | ✅ PASS |
| III. Design System | Modal de exclusão usa scrim escuro padrão; formulário usa `Input`/`Button` do design system. | ✅ PASS |
| IV. Segurança | `createCategory`/`updateCategory`/`deleteCategory` usam `service_role` apenas dentro de Server Actions, nunca expostos ao cliente; acesso restrito a sessão válida com papel `admin`/`editor` (middleware + `getCurrentAdminProfile()` de 005). | ✅ PASS |
| V. Simplicidade | Sem hierarquia de categorias nem reclassificação em massa nesta versão (Assumptions). Reaproveita contratos de 001 sem reescrever. | ✅ PASS |
| VI. TDD Obrigatório | Testes de geração/duplicidade de slug e de bloqueio de exclusão escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/006-admin-categorias/
├── plan.md   # Este arquivo — não há research.md/data-model.md/contracts/quickstart.md
│             # próprios; consulte os equivalentes em specs/001-vitrine-catalogo/
└── tasks.md  # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/(admin)/categorias/
│   └── page.tsx                      # RSC — compõe CategoryList + entradas para criar/editar
└── features/admin/categories/
    ├── components/
    │   ├── CategoryList.tsx           # RSC — listagem completa de categorias
    │   ├── CategoryForm.tsx            # Client — criação/edição, sugestão e edição manual de slug
    │   └── DeleteCategoryModal.tsx      # Client — confirmação com scrim escuro, exibe mensagem de bloqueio
    ├── actions.ts                        # createCategory, updateCategory, deleteCategory — já contratados em 001
    ├── schemas.ts                          # categorySchema (Zod) — já referenciado em 001
    └── index.ts                              # Barrel já previsto em 001
```

**Structure Decision**: Nenhuma pasta nova — reaproveita `features/admin/categories/` já planejado em 001 (linhas 100-102 do plan.md de referência). `deleteCategory` permanece a única fonte de verdade sobre o bloqueio por produtos vinculados; a UI apenas exibe a mensagem de erro retornada, sem duplicar a verificação no client.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
