# Implementation Plan: Gestão de Produtos (CRUD) no Painel Administrativo

**Branch**: `007-admin-produtos-crud` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-admin-produtos-crud/spec.md`

## Summary

CRUD completo de produtos (criar, editar, ativar/desativar, excluir) restrito a usuários autenticados (`admin`/`editor`), com geração automática de slug, exigência de categoria válida e validação de estoque não-negativo. Gerenciamento de imagens (spec 008) e de destaques (spec 009) ficam explicitamente fora de escopo. Reaproveita integralmente a stack, o modelo de dados (`products`) e os contratos `createProduct`/`updateProduct`/`deleteProduct` já definidos em [specs/001-vitrine-catalogo/plan.md](../001-vitrine-catalogo/plan.md), incluindo o cascade de exclusão de `product_images` (edge case desta spec sobre produto excluído com imagens já coberto em 001). Esta feature não introduz nenhuma entidade, contrato ou decisão técnica nova — por isso não há `research.md`, `data-model.md`, `contracts/` ou `quickstart.md` próprios; consulte os equivalentes em [001-vitrine-catalogo/data-model.md](../001-vitrine-catalogo/data-model.md) e [001-vitrine-catalogo/contracts/server-actions.md](../001-vitrine-catalogo/contracts/server-actions.md#server-actions--admin-produtos-featuresadminprodutosactionsts).

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router), Tailwind CSS, React 18+, Zod (validação de `productSchema`)

**Storage**: PostgreSQL (Supabase) — leitura e escrita em `products`, leitura de `categories` para popular o seletor; `deleteProduct` exclui em cascade os registros de `product_images` e os arquivos correspondentes no Storage (já contratado em 001).

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `createProduct`/`updateProduct` (geração de slug, rejeição de slug duplicado, exigência de categoria válida, rejeição de estoque negativo) e `deleteProduct` (cascade de imagens); React Testing Library cobre `ProductForm` (edição manual do slug, toggle de status independente do estoque) e `DeleteProductModal` (scrim escuro).

**Target Platform**: Web, rotas `/admin/produtos`, protegidas por `middleware.ts` (spec 005-admin-autenticacao, pré-requisito); seletor de categoria depende de `getCategories()` (spec 006-admin-categorias, pré-requisito).

**Project Type**: Web application — tela do painel administrativo, dentro da estrutura já definida em 001.

**Performance Goals**: Cadastro válido em 1 submissão de formulário na maioria dos casos (SC-001); toggle de status em no máximo 1 interação além de confirmação, quando aplicável (SC-004).

**Constraints**:
- Slug é gerado automaticamente a partir do nome, mas editável antes de salvar (FR-002).
- Slug duplicado entre produtos diferentes MUST ser rejeitado antes de persistir qualquer alteração (FR-003, SC-003).
- Categoria informada MUST existir no momento da criação/edição — categoria excluída entre carregamento do form e submissão é rejeitada com erro claro (FR-004, Edge Case).
- Estoque MUST ser inteiro não-negativo (FR-005, CHECK `>= 0` já no banco, defesa em profundidade na validação Zod).
- Status (ativo/inativo) e estoque são controles independentes — alternar um nunca modifica o outro (FR-007, Edge Case).
- Produtos inativos permanecem visíveis/editáveis no admin, apenas ocultos da vitrine pública (FR-008).
- Exclusão exige confirmação via modal com scrim escuro (FR-009, Princípio III) e NÃO é soft-delete (Assumptions).
- Esta feature NÃO implementa upload/crop/galeria de imagens nem reordenação de destaques (FR-012, Assumptions) — apenas consome os campos de `products` que não pertencem a esses domínios.

**Scale/Scope**: ~100 produtos (mesma escala da vitrine pública, spec 002).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Gestão de produtos é exclusivamente administrativa; não introduz carrinho, checkout ou login de usuário final. | ✅ PASS |
| II. Server Component | Listagem (`ProductList`) é RSC; `ProductForm` e `DeleteProductModal` são Client (formulário extenso e modal interativos). | ✅ PASS |
| III. Design System | Modal de exclusão usa scrim escuro padrão; formulário usa `Input`/`Select`/`Textarea`/`Button` do design system. | ✅ PASS |
| IV. Segurança | `createProduct`/`updateProduct`/`deleteProduct` usam `service_role` apenas dentro de Server Actions; acesso restrito a sessão válida com papel `admin`/`editor`. | ✅ PASS |
| V. Simplicidade | Sem soft-delete/lixeira nesta versão (Assumptions). Reaproveita contratos de 001 sem reescrever; não duplica escopo de imagens/destaques. | ✅ PASS |
| VI. TDD Obrigatório | Testes de geração/duplicidade de slug, validação de categoria/estoque e cascade de exclusão escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/007-admin-produtos-crud/
├── plan.md   # Este arquivo — não há research.md/data-model.md/contracts/quickstart.md
│             # próprios; consulte os equivalentes em specs/001-vitrine-catalogo/
└── tasks.md  # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/(admin)/produtos/
│   ├── page.tsx                       # RSC — compõe ProductList + entradas para criar/editar
│   ├── novo/page.tsx                  # RSC — compõe ProductForm em modo criação
│   └── [id]/page.tsx                   # RSC — compõe ProductForm em modo edição
└── features/admin/products/
    ├── components/
    │   ├── ProductList.tsx              # RSC — listagem completa, incluindo inativos
    │   ├── ProductForm.tsx                # Client — criação/edição, slug, toggle de status
    │   └── DeleteProductModal.tsx          # Client — confirmação com scrim escuro
    ├── actions.ts                            # createProduct, updateProduct, deleteProduct — já contratados em 001
    ├── schemas.ts                              # productSchema (Zod) — já referenciado em 001
    └── index.ts                                  # Barrel já previsto em 001
```

**Structure Decision**: Nenhuma pasta nova — reaproveita `features/admin/products/` já planejado em 001. O seletor de categoria dentro de `ProductForm` consome `getCategories()` de `features/admin/categories/` (spec 006), sem duplicar a query. Upload de imagens e reordenação de destaques permanecem fora desta árvore, em `features/admin/products/components/` apenas quando suas próprias specs (008, 009) os introduzirem.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
