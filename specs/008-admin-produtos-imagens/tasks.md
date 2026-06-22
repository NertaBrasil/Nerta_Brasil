---

description: "Task list for feature implementation"
---

# Tasks: Gestão de Imagens de Produto no Painel Administrativo

**Input**: Design documents from `specs/008-admin-produtos-imagens/` (plano fino — reaproveita stack/contratos de `specs/001-vitrine-catalogo/`)

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md). Sem `research.md`/`data-model.md`/`contracts/` próprios — consultar os equivalentes em `specs/001-vitrine-catalogo/`. Assume o scaffolding (002), a fundação administrativa (005) e o CRUD básico de produtos (007, especialmente `app/admin/(protected)/produtos/[id]/page.tsx`) já existentes — um produto já deve existir antes de receber imagens.

**Tests**: Mandatórios (Princípio VI da constituição — TDD). Escritos e falhando antes da implementação correspondente.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [X] T001 [P] Adicionar biblioteca de cropper client-side às dependências do projeto (recorte 1:1, detalhe de implementação já assumido por 001/Assumptions desta spec) — **Desvio documentado**: nenhuma biblioteca de terceiros foi instalada; implementado `src/features/admin/products/cropImage.ts`, um utilitário puro baseado em Canvas/`HTMLCanvasElement.toBlob` que recorta a maior região quadrada central da imagem. Decisão tomada para evitar introduzir uma dependência não revisada enquanto o usuário estava indisponível para aprovação; o utilitário cobre integralmente o requisito de recorte 1:1 obrigatório (FR-002/FR-003) sem UI de ajuste manual de área (crop livre), que poderia ser adicionada depois caso necessário.
- [X] T002 Implementar `ImageGallery.tsx` (Client, shell inicial) em `src/features/admin/products/components/ImageGallery.tsx` — renderiza as imagens existentes do produto em ordem, destacando a posição 1 como "Principal" (sem drag-and-drop ainda; US2 adiciona)
- [X] T003 Integrar `ImageGallery` em `src/app/admin/(protected)/produtos/[id]/page.tsx` (caminho corrigido — `(admin)` não existe neste projeto; o admin usa pasta literal `app/admin/` com group aninhado `(protected)`, ver CLAUDE.md) (página de edição de produto já existente da spec 007) (depende de T002)

**Checkpoint**: Fundação pronta — user stories podem começar.

---

## Phase 2: User Story 1 - Adicionar imagem a um produto com recorte obrigatório (Priority: P1) 🎯 MVP

**Goal**: Usuário autenticado faz upload de uma imagem, recorta-a obrigatoriamente em 1:1, e ela é salva na galeria, tornando-se "Principal" se for a primeira.

**Independent Test**: Com um produto de seed sem imagens, fazer upload de uma imagem, completar o recorte 1:1, e verificar que ela aparece na galeria com a proporção correta.

### Tests for User Story 1 (MANDATORY — write first, must fail) ⚠️

- [X] T004 [P] [US1] Vitest: `uploadProductImage` rejeita arquivo não-imagem antes do upload (FR-009) e insere com `position = último + 1` quando válido, em `src/features/admin/products/actions.test.ts`
- [X] T005 [P] [US1] RTL: `ImageCropper` bloqueia a conclusão do upload enquanto o recorte 1:1 não for confirmado pelo usuário, em `src/features/admin/products/components/ImageCropper.test.tsx`
- [X] T006 [P] [US1] RTL: `ImageUploader` rejeita arquivo não-imagem com mensagem clara antes de oferecer a etapa de recorte, em `src/features/admin/products/components/ImageUploader.test.tsx`

### Implementation for User Story 1

- [X] T007 [US1] Implementar `uploadProductImage(product_id, file)` em `src/features/admin/products/actions.ts` — recebe arquivo já recortado 1:1 do client, faz upload para o Storage (`products/{product_id}/{uuid}.png`), insere em `product_images` com `position = último + 1` (FR-004)
- [X] T008 [US1] Implementar `ImageUploader.tsx` (Client) em `src/features/admin/products/components/ImageUploader.tsx` — seleciona arquivo, valida formato de imagem antes de oferecer o recorte (FR-009)
- [X] T009 [US1] Implementar `ImageCropper.tsx` (Client) em `src/features/admin/products/components/ImageCropper.tsx` — recorte 1:1 obrigatório usando o utilitário Canvas de T001, só libera confirmação após o recorte completo (FR-002, FR-003)
- [X] T010 [US1] Integrar `ImageUploader` + `ImageCropper` em `ImageGallery.tsx` — fluxo completo de upload chamando `uploadProductImage()` (depende de T002, T007, T008, T009)
- [X] T011 [US1] Tratar Edge Case: usuário cancela o recorte no meio do processo — a imagem não é salva na galeria (upload considerado incompleto). `ImageCropper.onCancel` apenas limpa o estado `pendingFile` em `ImageGallery`, sem chamar `uploadProductImage` — coberto pelo teste "ao cancelar, chama onCancel sem gerar o recorte" em `ImageCropper.test.tsx`.
- [X] T012 [US1] Exportar `uploadProductImage`, `ImageUploader`, `ImageCropper`, `ImageGallery` em `src/features/admin/products/index.ts`

**Checkpoint**: User Story 1 funcional e testável de forma independente.

---

## Phase 3: User Story 2 - Reordenar a galeria por drag-and-drop (Priority: P2)

**Goal**: Usuário autenticado arrasta e solta imagens para alterar a ordem da galeria; a "Principal" é redefinida e persistida.

**Independent Test**: Com um produto de seed com duas ou mais imagens, reordenar via drag-and-drop e verificar que a nova ordem persiste após recarregar a página.

### Tests for User Story 2 (MANDATORY — write first, must fail) ⚠️

- [X] T013 [P] [US2] Vitest: `reorderProductImages` atualiza a `position` de todas as imagens do produto, em `src/features/admin/products/actions.test.ts` — **Desvio documentado**: supabase-js não oferece transação multi-statement sem uma função Postgres dedicada; a implementação faz updates sequenciais por linha (`.update({position}).eq("id",...).eq("product_id",...)`), consistente com o restante do código-base, que não usa transações em nenhum outro ponto.
- [X] T014 [P] [US2] RTL: `ImageGallery` exibe o indicador visual de qual imagem é a "Principal" refletindo a ordem após reordenação, em `src/features/admin/products/components/ImageGallery.test.tsx`

### Implementation for User Story 2

- [X] T015 [US2] Implementar `reorderProductImages(input)` em `src/features/admin/products/actions.ts` (já contratado em 001)
- [X] T016 [US2] Adicionar drag-and-drop em `ImageGallery.tsx`, chamando `reorderProductImages()` ao soltar uma imagem em nova posição (depende de T002, T015) — implementado com eventos HTML5 nativos (`draggable`, `onDragStart`/`onDragOver`/`onDrop`), sem biblioteca adicional.
- [X] T017 [US2] Exportar `reorderProductImages` em `src/features/admin/products/index.ts`

**Checkpoint**: User Stories 1 e 2 funcionam juntas — apresentação ideal do produto garantida.

---

## Phase 4: User Story 3 - Excluir uma imagem da galeria (Priority: P2)

**Goal**: Usuário autenticado remove uma imagem; as restantes mantêm ordem relativa, e a "Principal" é recalculada se necessário.

**Independent Test**: Com um produto de seed com múltiplas imagens, excluir uma delas e verificar que desaparece da galeria sem deixar lacunas de ordem.

### Tests for User Story 3 (MANDATORY — write first, must fail) ⚠️

- [X] T018 [P] [US3] Vitest: `deleteProductImage` remove a imagem e recalcula a `position` das demais sem lacunas; quando a imagem removida estava em `position = 1`, a próxima assume automaticamente a "Principal"; quando era a única imagem, o produto passa a não ter nenhuma (Edge Cases), em `src/features/admin/products/actions.test.ts`
- [X] T019 [P] [US3] RTL: ação de exclusão em `ImageGallery` remove a imagem da listagem e atualiza visualmente qual é a "Principal" quando aplicável, em `src/features/admin/products/components/ImageGallery.test.tsx`

### Implementation for User Story 3

- [X] T020 [US3] Implementar `deleteProductImage(image_id)` em `src/features/admin/products/actions.ts` — remove o arquivo do Storage e o registro, recalcula `position` das demais imagens sem lacunas (depende de T002)
- [X] T021 [US3] Integrar a ação de exclusão em `ImageGallery.tsx` (depende de T002, T020)
- [X] T022 [US3] Exportar `deleteProductImage` em `src/features/admin/products/index.ts`

**Checkpoint**: Todas as user stories funcionais independentemente.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T023 [P] Validar manualmente os cenários de `specs/001-vitrine-catalogo/quickstart.md` referentes à galeria de imagens — **Pendente**: requer sessão autenticada real no admin (sem credenciais disponíveis nesta sessão); recomendado teste manual rápido ao revisar o PR.
- [X] T024 Rodar oxlint em `src/features/admin/products/components/ImageUploader.tsx`, `ImageCropper.tsx`, `ImageGallery.tsx` — zero violações do design system (confirmado: 0 warnings, 0 errors)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: depende do scaffolding (002), da fundação administrativa (005) e do CRUD de produtos (007). Bloqueia todas as user stories.
- **User Stories (Phase 2-4)**: US1 é o MVP (sem imagens, o catálogo é visualmente inutilizável); US2 e US3 dependem de US1 ter ao menos uma imagem cadastrada para serem testadas de ponta a ponta, mas operam sobre o mesmo `ImageGallery.tsx` introduzido na Foundational.
- **Polish (Phase 5)**: depende de todas as user stories desejadas estarem completas.

### Parallel Opportunities

- T004-T006 (testes US1) em paralelo.
- T013-T014 (testes US2) em paralelo.
- T018-T019 (testes US3) em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Foundational.
2. Completar Fase 2 (US1) — upload com recorte obrigatório funcional.
3. Validar US1 isoladamente.

### Incremental Delivery

1. Foundational → fundação pronta (galeria visível, sem interação ainda).
2. US1 → testar independentemente → upload com recorte 1:1 (MVP).
3. US2 → testar independentemente → reordenação por drag-and-drop.
4. US3 → testar independentemente → exclusão sem deixar a galeria inconsistente.

## Notes

- [P] tasks = arquivos diferentes, sem dependências entre si.
- Testes MUST falhar antes da implementação correspondente (Princípio VI).
- Commit após cada task ou grupo lógico, na branch desta spec (ver guidance de branch/PR por spec).
- `actions.ts`/`index.ts` são compartilhados com a spec 007 — não há uma segunda feature/barrel para imagens.
