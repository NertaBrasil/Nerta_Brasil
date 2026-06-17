# Implementation Plan: Gestão de Imagens de Produto no Painel Administrativo

**Branch**: `008-admin-produtos-imagens` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-admin-produtos-imagens/spec.md`

## Summary

Upload de imagens com recorte 1:1 obrigatório no client, reordenação da galeria por drag-and-drop e exclusão, restritos a usuários autenticados (`admin`/`editor`), para produtos já existentes (spec 007, pré-requisito). A imagem em `position = 1` é a "Principal", consumida pelo catálogo público (spec 002) e pela página de detalhe (spec 003). Reaproveita integralmente a stack, o modelo de dados (`product_images`) e os contratos `uploadProductImage`/`deleteProductImage`/`reorderProductImages` já definidos em [specs/001-vitrine-catalogo/plan.md](../001-vitrine-catalogo/plan.md), incluindo a convenção de path no Storage e o cascade de exclusão ao remover um produto (edge case desta spec já coberto em 001). Esta feature não introduz nenhuma entidade, contrato ou decisão técnica nova — por isso não há `research.md`, `data-model.md`, `contracts/` ou `quickstart.md` próprios; consulte os equivalentes em [001-vitrine-catalogo/data-model.md](../001-vitrine-catalogo/data-model.md#product_images) e [001-vitrine-catalogo/contracts/server-actions.md](../001-vitrine-catalogo/contracts/server-actions.md) e [001-vitrine-catalogo/contracts/types.ts](../001-vitrine-catalogo/contracts/types.ts) (`ProductImage`, `ReorderImagesInput`).

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Tailwind CSS, biblioteca de cropper client-side (recorte 1:1 antes do upload, já assumida como detalhe de implementação por 001/Assumptions desta spec), Supabase Storage

**Storage**: PostgreSQL (Supabase) — leitura/escrita em `product_images` (`position`, `storage_path`, `product_id`), já definida em `001-vitrine-catalogo/data-model.md`; Supabase Storage para os arquivos, path `products/{product_id}/{uuid}.png` (convenção já fixada em 001).

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre `uploadProductImage` (rejeição de arquivo não-imagem, posição = último + 1), `deleteProductImage` (recalculo de `position` sem lacunas, recalculo da "Principal" quando a posição 1 é removida) e `reorderProductImages` (atualização atômica de todas as posições); React Testing Library cobre o componente de cropper (bloqueio de conclusão sem recorte confirmado) e a galeria drag-and-drop (indicador visual de qual imagem é a "Principal").

**Target Platform**: Web, tela de detalhe de produto dentro de `/admin/produtos/[id]`, protegida por `middleware.ts` (spec 005-admin-autenticacao, pré-requisito); depende do produto já existir (spec 007-admin-produtos-crud, pré-requisito).

**Project Type**: Web application — submódulo do painel administrativo de produtos, dentro da estrutura já definida em 001.

**Performance Goals**: Exclusão de imagem em no máximo 1 interação principal sem deixar a galeria em estado inconsistente (SC-004); reordenação refletida na vitrine pública sem etapas adicionais de publicação (SC-002).

**Constraints**:
- Toda imagem MUST ser recortada em proporção exatamente 1:1 no client antes do upload — apenas imagens já recortadas chegam ao Storage (FR-002, FR-003, Assumptions).
- Arquivos não-imagem MUST ser rejeitados antes da etapa de recorte (FR-009, SC-003).
- Novas imagens MUST ser adicionadas ao final da ordem atual, sem alterar a posição das existentes (FR-004).
- Exclusão ou reordenação da imagem em `position = 1` MUST recalcular automaticamente qual imagem assume a posição "Principal", sem lacunas de ordem (FR-008, Edge Case).
- Reordenação por drag-and-drop é necessariamente `"use client"`; persistência ocorre via `reorderProductImages` em uma única transação (já contratado em 001).
- Sem resolução de conflito em tempo real para reordenações simultâneas — a última ordem salva prevalece (Edge Case, Assumptions).

**Scale/Scope**: Sem limite explícito de imagens por produto nesta versão (Assumptions) — limite técnico, se necessário, é detalhe de implementação, não de design.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Gestão de galeria é exclusivamente administrativa; a vitrine pública apenas consome `cover_image`/`images` já resolvidos pelas queries existentes (spec 002/003). | ✅ PASS |
| II. Server Component | Tela hospedeira (`/admin/produtos/[id]`) é RSC; `ImageUploader`, `ImageCropper` e `ImageGallery` (drag-and-drop) são Client. | ✅ PASS |
| III. Design System | Crop 1:1 é a própria regra do design system para imagens de produto (Princípio III); galeria usa tokens existentes para destacar a imagem "Principal". | ✅ PASS |
| IV. Segurança | `uploadProductImage`/`deleteProductImage`/`reorderProductImages` usam `service_role` apenas dentro de Server Actions; acesso restrito a sessão válida com papel `admin`/`editor`. | ✅ PASS |
| V. Simplicidade | Sem resolução de conflito em tempo real para edição concorrente (Assumptions). Reaproveita contratos de 001 sem reescrever. | ✅ PASS |
| VI. TDD Obrigatório | Testes de rejeição de arquivo inválido, recalculo de posição/"Principal" e atomicidade da reordenação escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/008-admin-produtos-imagens/
├── plan.md   # Este arquivo — não há research.md/data-model.md/contracts/quickstart.md
│             # próprios; consulte os equivalentes em specs/001-vitrine-catalogo/
└── tasks.md  # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
└── features/admin/produtos/
    ├── components/
    │   ├── ImageUploader.tsx       # Client — seleciona arquivo, valida formato (FR-009)
    │   ├── ImageCropper.tsx         # Client — recorte 1:1 obrigatório antes de confirmar
    │   └── ImageGallery.tsx          # Client — drag-and-drop, indicador de "Principal", exclusão
    ├── actions.ts                     # uploadProductImage, deleteProductImage, reorderProductImages — já contratados em 001
    └── index.ts                         # Barrel já previsto em 001 (mesma feature de 007)
```

**Structure Decision**: Nenhuma pasta nova — os componentes de imagem entram em `features/admin/produtos/components/`, ao lado de `ProductForm.tsx` (spec 007), já que pertencem ao mesmo domínio (`produtos`) previsto em 001. `actions.ts` e `index.ts` são compartilhados com a spec 007 (CRUD básico), sem necessidade de uma segunda feature/barrel.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
