# Feature Specification: Gestão de Imagens de Produto no Painel Administrativo

**Feature Branch**: `008-admin-produtos-imagens`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Gestão da galeria de imagens de um produto no painel administrativo da Nerta Brasil: usuários admin/editor autenticados fazem upload de imagens para um produto já existente, recortam cada imagem obrigatoriamente em proporção 1:1 antes de salvar, reordenam a galeria por drag-and-drop, e excluem imagens. A primeira imagem da galeria (posição 0) é a 'Principal', usada no card do catálogo público e como capa na página de detalhe — a ordem é persistida. Esta feature assume que o cadastro básico de produtos (admin-produtos-crud) já existe como pré-requisito — um produto já deve existir antes que imagens possam ser associadas a ele. Esta é uma das specs menores derivadas do escopo arquitetural geral definido em specs/001-vitrine-catalogo (que permanece como referência de arquitetura, não como spec de implementação)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Adicionar imagem a um produto com recorte obrigatório (Priority: P1)

Um usuário administrativo autenticado seleciona um produto existente, faz upload de uma imagem, recorta-a obrigatoriamente em proporção 1:1, e a imagem é salva na galeria do produto.

**Why this priority**: É a operação fundamental — sem imagens, o produto não pode ser apresentado adequadamente na vitrine pública (card do catálogo, página de detalhe), tornando o catálogo visualmente inutilizável.

**Independent Test**: Pode ser testado isoladamente com um produto de seed sem imagens, fazendo upload de uma imagem, completando o recorte 1:1, e verificando que a imagem aparece na galeria do produto com a proporção correta.

**Acceptance Scenarios**:

1. **Given** um produto existente sem imagens, **When** um usuário autenticado faz upload de uma imagem e completa o recorte 1:1, **Then** a imagem é salva na galeria do produto, tornando-se automaticamente a "Principal" por ser a primeira.
2. **Given** um usuário fez upload de uma imagem, **When** ele tenta salvar sem completar o recorte 1:1, **Then** o sistema impede a conclusão do upload até que o recorte seja realizado.
3. **Given** um produto já possui imagens cadastradas, **When** um usuário autenticado adiciona uma nova imagem com recorte 1:1, **Then** a nova imagem é adicionada ao final da galeria, sem alterar a posição das imagens existentes.

---

### User Story 2 - Reordenar a galeria por drag-and-drop (Priority: P2)

Um usuário administrativo autenticado arrasta e solta imagens dentro da galeria de um produto para alterar sua ordem, e a nova ordem é persistida, incluindo a definição de qual imagem é a "Principal".

**Why this priority**: É importante para apresentação ideal do produto (escolher a melhor foto como capa), mas o produto já é funcional com a ordem padrão de upload (P1) — por isso é a segunda prioridade.

**Independent Test**: Pode ser testado isoladamente com um produto de seed com duas ou mais imagens, reordenando-as via drag-and-drop, e verificando que a nova ordem persiste após recarregar a página, e que o card do catálogo público passa a usar a nova imagem principal.

**Acceptance Scenarios**:

1. **Given** um produto com múltiplas imagens na galeria, **When** um usuário autenticado arrasta uma imagem para a primeira posição, **Then** essa imagem passa a ser a "Principal" e a nova ordem é persistida.
2. **Given** a ordem da galeria foi alterada, **When** um visitante acessa o card do produto no catálogo público ou sua página de detalhe, **Then** a imagem exibida como capa é a que está na primeira posição da galeria.

---

### User Story 3 - Excluir uma imagem da galeria (Priority: P2)

Um usuário administrativo autenticado remove uma imagem da galeria de um produto, e as imagens restantes mantêm sua ordem relativa, com a "Principal" sendo recalculada se necessário.

**Why this priority**: É necessário para manutenção e correção de erros (imagem errada, baixa qualidade), mas não é tão crítico quanto adicionar a primeira imagem de um produto novo — por isso compartilha prioridade com a reordenação.

**Independent Test**: Pode ser testado isoladamente com um produto de seed com múltiplas imagens, excluindo uma delas, e verificando que ela desaparece da galeria e que as demais mantêm ordem relativa coerente.

**Acceptance Scenarios**:

1. **Given** um produto com múltiplas imagens, **When** um usuário autenticado exclui uma imagem que não é a "Principal", **Then** a imagem é removida e a ordem das demais é mantida, sem criar lacunas.
2. **Given** um produto com múltiplas imagens, **When** um usuário autenticado exclui a imagem "Principal" (primeira posição), **Then** a imagem seguinte na ordem assume automaticamente a posição de "Principal".
3. **Given** um produto possui apenas uma imagem, **When** um usuário autenticado a exclui, **Then** o produto passa a não ter nenhuma imagem, e a vitrine pública exibe um placeholder visual para ele.

---

### Edge Cases

- O que acontece quando um usuário tenta fazer upload de um arquivo que não é uma imagem (ex: PDF, vídeo)? O sistema deve rejeitar o arquivo com uma mensagem clara antes de oferecer a etapa de recorte.
- O que acontece quando o usuário cancela o recorte no meio do processo? A imagem não deve ser salva na galeria — o upload é considerado incompleto até o recorte 1:1 ser confirmado.
- O que acontece quando dois usuários administrativos reordenam a galeria do mesmo produto simultaneamente? A última ordem salva prevalece; esta versão não trata resolução de conflito em tempo real.
- O que acontece quando um produto é excluído (feature admin-produtos-crud) e ainda possui imagens na galeria? As imagens associadas devem ser removidas/desvinculadas como consequência, evitando arquivos órfãos no armazenamento.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que um usuário administrativo autenticado faça upload de uma ou mais imagens para um produto existente.
- **FR-002**: O sistema MUST exigir que toda imagem seja recortada em proporção exatamente 1:1 antes de ser salva na galeria do produto.
- **FR-003**: O sistema MUST impedir a conclusão de um upload de imagem enquanto o recorte 1:1 não tiver sido confirmado pelo usuário.
- **FR-004**: O sistema MUST adicionar novas imagens ao final da ordem atual da galeria do produto, preservando a posição das imagens já existentes.
- **FR-005**: O sistema MUST tratar a imagem na primeira posição da galeria como a imagem "Principal" do produto.
- **FR-006**: O sistema MUST permitir que um usuário administrativo autenticado reordene as imagens da galeria por drag-and-drop, persistindo a nova ordem.
- **FR-007**: O sistema MUST permitir que um usuário administrativo autenticado exclua qualquer imagem da galeria de um produto.
- **FR-008**: O sistema MUST recalcular automaticamente qual imagem é a "Principal" quando a imagem que ocupava essa posição é excluída ou reordenada.
- **FR-009**: O sistema MUST rejeitar arquivos que não sejam de um formato de imagem suportado, antes de oferecer a etapa de recorte.
- **FR-010**: O sistema MUST restringir todas as operações de gestão de imagens (upload, recorte, reordenação, exclusão) a usuários autenticados com papel administrativo válido.
- **FR-011**: O sistema MUST refletir, na vitrine pública (card do catálogo e página de detalhe), a imagem atualmente na primeira posição da galeria como capa/imagem principal.

### Key Entities

- **Imagem de Produto**: Arquivo de imagem vinculado a um produto — posição na galeria (determina ordem de exibição e qual é a "Principal"), proporção fixa 1:1, e referência ao produto ao qual pertence.
- **Produto (referência)**: Consumido por esta feature como o item ao qual a galeria pertence; seu cadastro básico (nome, slug, etc.) é gerido pela feature admin-produtos-crud, fora de escopo aqui.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das imagens salvas na galeria de qualquer produto possuem proporção exatamente 1:1, sem exceção.
- **SC-002**: Um usuário administrativo consegue reordenar a galeria de um produto e ver a nova imagem principal refletida na vitrine pública sem etapas adicionais de publicação.
- **SC-003**: 100% das tentativas de upload de arquivos não-imagem são rejeitadas antes da etapa de recorte.
- **SC-004**: Um usuário administrativo consegue excluir uma imagem da galeria em no máximo 1 interação principal (mais confirmação, quando aplicável), sem deixar a galeria em estado inconsistente (lacunas de ordem ou "Principal" indefinida).

## Assumptions

- O cadastro básico do produto (spec 007-admin-produtos-crud) já existe como pré-requisito — esta feature não cria produtos, apenas anexa imagens a produtos existentes.
- O armazenamento físico das imagens (Supabase Storage) é um detalhe de implementação a ser resolvido na fase de planejamento técnico, não nesta especificação.
- Não há limite explícito de quantidade de imagens por produto definido nesta versão; um limite técnico razoável pode ser definido na fase de planejamento.
- A ferramenta de recorte (cropper) é sempre client-side antes do upload final, garantindo que apenas imagens já na proporção correta cheguem ao armazenamento.
- Tanto o papel 'admin' quanto 'editor' têm permissão para gerenciar imagens de produto nesta versão.
