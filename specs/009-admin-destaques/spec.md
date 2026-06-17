# Feature Specification: Gestão de Produtos em Destaque no Painel Administrativo

**Feature Branch**: `009-admin-destaques`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Gestão de produtos em destaque no painel administrativo da Nerta Brasil: usuários admin/editor autenticados marcam ou desmarcam produtos ativos como 'destaque' (featured), controlando quais produtos aparecem na seção de destaques da home pública. A tela exibe uma grade dos produtos marcados como destaque, permitindo reordenar essa grade por drag-and-drop — a ordem definida aqui é a ordem de exibição na home. Esta feature assume que o cadastro básico de produtos (admin-produtos-crud) já existe como pré-requisito. Esta é uma das specs menores derivadas do escopo arquitetural geral definido em specs/001-vitrine-catalogo (que permanece como referência de arquitetura, não como spec de implementação)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marcar um produto como destaque (Priority: P1)

Um usuário administrativo autenticado marca um produto ativo como destaque, e esse produto passa a aparecer na seção de destaques da home pública.

**Why this priority**: É a operação fundamental desta feature — sem a capacidade de marcar produtos, a seção de destaques da home (spec 004-home-landing) nunca exibe nenhum conteúdo curado.

**Independent Test**: Pode ser testado isoladamente com um produto ativo de seed sem a flag de destaque, marcando-o como destaque, e verificando que ele passa a aparecer na grade de destaques do admin e, consequentemente, estaria elegível para a home pública.

**Acceptance Scenarios**:

1. **Given** um produto ativo não marcado como destaque, **When** um usuário autenticado o marca como destaque, **Then** o produto passa a aparecer na grade de destaques do painel administrativo.
2. **Given** um produto está inativo, **When** um usuário autenticado tenta marcá-lo como destaque, **Then** o sistema permite a marcação, mas o produto não aparece na home pública enquanto permanecer inativo (a exibição pública depende de `active = true` E `featured = true`).

---

### User Story 2 - Desmarcar um produto como destaque (Priority: P1)

Um usuário administrativo autenticado remove a marcação de destaque de um produto, e ele deixa de aparecer na seção de destaques da home pública.

**Why this priority**: É o complemento direto e igualmente necessário da marcação — sem a capacidade de desmarcar, a curadoria de destaques só poderia crescer, nunca ser ajustada, tornando a feature incompleta.

**Independent Test**: Pode ser testado isoladamente com um produto de seed já marcado como destaque, desmarcando-o, e verificando que ele desaparece da grade de destaques do admin.

**Acceptance Scenarios**:

1. **Given** um produto está marcado como destaque, **When** um usuário autenticado remove essa marcação, **Then** o produto desaparece da grade de destaques do admin e da seção de destaques da home pública.

---

### User Story 3 - Reordenar a grade de destaques (Priority: P2)

Um usuário administrativo autenticado arrasta e solta produtos dentro da grade de destaques para definir a ordem em que eles aparecem na home pública.

**Why this priority**: Refina a apresentação (quais produtos aparecem primeiro), mas a seção de destaques já é funcional com qualquer ordem padrão (P1/P2 cobrem a curadoria básica) — por isso é a segunda prioridade.

**Independent Test**: Pode ser testado isoladamente com dois ou mais produtos marcados como destaque, reordenando-os via drag-and-drop, e verificando que a nova ordem persiste e se reflete na home pública.

**Acceptance Scenarios**:

1. **Given** múltiplos produtos marcados como destaque, **When** um usuário autenticado reordena a grade via drag-and-drop, **Then** a nova ordem é persistida e refletida na seção de destaques da home pública.

---

### Edge Cases

- O que acontece quando nenhum produto está marcado como destaque? A grade do admin exibe um estado vazio claro, e a home pública omite a seção de destaques (comportamento já coberto pela spec 004-home-landing).
- O que acontece quando um produto marcado como destaque é desativado (via admin-produtos-crud)? Ele permanece marcado como destaque internamente, mas desaparece da home pública até ser reativado, sem precisar ser desmarcado e remarcado.
- O que acontece quando um produto marcado como destaque é excluído permanentemente (via admin-produtos-crud)? Ele deve ser removido automaticamente da grade de destaques, sem deixar referências inválidas.
- O que acontece quando muitos produtos são marcados como destaque? Não há limite explícito definido nesta versão; a curadoria de quantidade fica a critério do usuário administrativo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que um usuário administrativo autenticado marque um produto ativo ou inativo como destaque.
- **FR-002**: O sistema MUST permitir que um usuário administrativo autenticado remova a marcação de destaque de qualquer produto.
- **FR-003**: O sistema MUST exibir, no painel administrativo, uma grade contendo todos os produtos atualmente marcados como destaque.
- **FR-004**: O sistema MUST permitir que um usuário administrativo autenticado reordene a grade de destaques por drag-and-drop, persistindo a nova ordem.
- **FR-005**: O sistema MUST refletir, na home pública, apenas produtos que sejam simultaneamente ativos e marcados como destaque, respeitando a ordem definida nesta tela.
- **FR-006**: O sistema MUST remover automaticamente um produto da grade de destaques caso ele seja excluído permanentemente.
- **FR-007**: O sistema MUST restringir a gestão de destaques (marcar, desmarcar, reordenar) a usuários autenticados com papel administrativo válido.
- **FR-008**: O sistema MUST exibir um estado vazio claro na grade de destaques quando nenhum produto estiver marcado.

### Key Entities

- **Produto (visão de destaque)**: Subconjunto de produtos com a flag `featured = true` — inclui posição/ordem dentro da grade de destaques, independentemente do status `active`.
- **Produto (referência)**: Consumido por esta feature como o item ao qual a marcação de destaque se aplica; seu cadastro básico é gerido pela feature admin-produtos-crud, fora de escopo aqui.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário administrativo consegue marcar ou desmarcar um produto como destaque em 1 interação (um clique/toggle).
- **SC-002**: 100% dos produtos exibidos na home pública como destaque atendem simultaneamente aos critérios `active = true` e `featured = true`.
- **SC-003**: Uma reordenação da grade de destaques se reflete na home pública sem exigir nenhuma etapa de publicação adicional.
- **SC-004**: 100% dos produtos excluídos permanentemente são removidos da grade de destaques, sem deixar referências quebradas.

## Assumptions

- O cadastro básico do produto (spec 007-admin-produtos-crud) já existe como pré-requisito — esta feature não cria produtos, apenas gerencia a flag de destaque e sua ordem.
- A renderização da seção de destaques na home pública (spec 004-home-landing) já existe como consumidora desta flag e ordem; esta spec apenas garante que os dados estejam corretos e disponíveis.
- Não há limite explícito de quantidade de produtos em destaque definido nesta versão.
- Tanto o papel 'admin' quanto 'editor' têm permissão para gerenciar destaques nesta versão.
