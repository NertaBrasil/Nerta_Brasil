# Feature Specification: Catálogo Público de Produtos

**Feature Branch**: `002-catalogo-publico`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Catálogo público de produtos da Nerta Brasil: uma página de listagem que exibe todos os produtos ativos em cards (imagem de capa, nome, linha comercial, descrição curta, indicador de disponibilidade), com filtro por categoria. O visitante navega pela lista, filtra por categoria de interesse, e clica em um card para ir à página de detalhe do produto (a página de detalhe é uma feature separada, fora de escopo aqui). Produtos com estoque zerado aparecem na listagem, mas marcados visualmente como indisponíveis. Produtos inativos nunca aparecem na listagem. Esta feature não inclui busca textual nem paginação — apenas listagem completa de produtos ativos com filtro por categoria."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar pelo catálogo completo (Priority: P1)

Um visitante chega à página de catálogo e vê todos os produtos ativos da Nerta Brasil organizados em cards, cada um com imagem, nome, linha comercial e descrição curta, podendo identificar rapidamente quais produtos têm interesse para investigar mais a fundo.

**Why this priority**: É o ponto de entrada central da vitrine — sem uma listagem funcional, não há descoberta de produto possível, e o catálogo é a principal porta de conversão para o Mercado Livre.

**Independent Test**: Pode ser testado isoladamente acessando a URL do catálogo com produtos de seed cadastrados (alguns ativos, alguns inativos, alguns com estoque zerado) e verificando que a lista exibida está correta sem depender de nenhuma outra feature.

**Acceptance Scenarios**:

1. **Given** existem produtos ativos cadastrados, **When** o visitante acessa a página de catálogo, **Then** todos os produtos ativos são exibidos em cards com imagem, nome, linha comercial e descrição curta.
2. **Given** existe um produto com `active = false`, **When** o visitante acessa o catálogo, **Then** esse produto não aparece em nenhuma posição da listagem.
3. **Given** existe um produto com estoque zerado, **When** o visitante visualiza seu card no catálogo, **Then** o card exibe um indicador visual de indisponibilidade, mas o produto continua listado.

---

### User Story 2 - Filtrar produtos por categoria (Priority: P2)

Um visitante que já sabe qual tipo de produto procura (ex: "linha agro") filtra a listagem por categoria para reduzir o número de cards exibidos e encontrar o produto certo mais rápido.

**Why this priority**: Acelera a descoberta para visitantes com intenção mais definida, mas o catálogo já entrega valor sem esse refinamento (P1 cobre a listagem completa) — por isso é a segunda prioridade, não a primeira.

**Independent Test**: Pode ser testado isoladamente aplicando um filtro de categoria existente e verificando que apenas produtos daquela categoria permanecem visíveis, sem depender de nenhuma outra feature.

**Acceptance Scenarios**:

1. **Given** o catálogo exibe produtos de múltiplas categorias, **When** o visitante seleciona uma categoria no filtro, **Then** apenas produtos ativos daquela categoria são exibidos.
2. **Given** um filtro de categoria está aplicado, **When** o visitante remove o filtro (ou seleciona "Todas"), **Then** a listagem completa de produtos ativos volta a ser exibida.
3. **Given** uma categoria não possui nenhum produto ativo vinculado, **When** o visitante seleciona essa categoria no filtro, **Then** a listagem exibe um estado vazio claro, sem erro.

---

### User Story 3 - Navegar do catálogo para o detalhe do produto (Priority: P3)

Um visitante encontra um produto de interesse no catálogo e clica no card para ir à página de detalhe, onde poderá ler especificações completas e seguir para a compra.

**Why this priority**: É o gatilho de transição para a feature de página de produto (fora de escopo aqui) — necessário para o fluxo de negócio completo, mas o catálogo em si (P1/P2) já é testável e demonstrável sem essa navegação funcionando.

**Independent Test**: Pode ser testado isoladamente verificando que cada card do catálogo é um link/elemento clicável que aponta para a URL de detalhe do produto correspondente (a página de destino em si é validada pela spec de página de produto).

**Acceptance Scenarios**:

1. **Given** o catálogo exibe um card de produto, **When** o visitante clica no card, **Then** o visitante é direcionado para a URL de detalhe daquele produto específico.

---

### Edge Cases

- O que acontece quando não existe nenhum produto ativo cadastrado no sistema? A listagem deve exibir um estado vazio claro, sem erro.
- O que acontece quando uma categoria usada no filtro é excluída no painel admin enquanto o visitante está com ela selecionada? O filtro deve voltar para "Todas as categorias" sem quebrar a página.
- O que acontece quando um produto não tem imagem de capa cadastrada? O card deve exibir um placeholder visual no lugar da imagem, sem quebrar o layout.
- O que acontece quando um produto pertence a uma categoria que não existe mais (órfão)? O produto continua aparecendo na listagem completa, mas não aparece em nenhum filtro de categoria específico.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir, na página de catálogo, todos os produtos com status ativo, e nenhum produto com status inativo.
- **FR-002**: O sistema MUST exibir, para cada produto na listagem, ao menos: imagem de capa (ou placeholder), nome, linha comercial e descrição curta.
- **FR-003**: O sistema MUST indicar visualmente, no card do produto, quando o estoque do produto é zero, sem removê-lo da listagem.
- **FR-004**: O sistema MUST permitir ao visitante filtrar a listagem por uma única categoria por vez.
- **FR-005**: O sistema MUST oferecer uma opção de filtro que retorna à listagem completa de produtos ativos (equivalente a "todas as categorias").
- **FR-006**: O sistema MUST exibir um estado vazio compreensível quando o filtro aplicado não retornar nenhum produto.
- **FR-007**: O sistema MUST tornar cada card de produto um ponto de navegação para a página de detalhe daquele produto.
- **FR-008**: O sistema MUST excluir produtos órfãos (sem categoria válida) apenas dos filtros de categoria, mantendo-os na listagem completa.
- **FR-009**: O sistema MUST carregar a listagem de produtos ativos sem exigir nenhuma ação de autenticação do visitante.

### Key Entities

- **Produto (visão de listagem)**: Representa um item do catálogo exibido como card — nome, linha comercial, descrição curta, imagem de capa, indicador de disponibilidade (derivado do estoque), categoria associada, e status ativo/inativo (controla visibilidade).
- **Categoria**: Agrupamento usado para filtrar produtos na listagem; cada produto pertence a no máximo uma categoria.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante consegue visualizar a listagem completa de produtos ativos em até 2 segundos após acessar a página, em condições normais de rede.
- **SC-002**: 100% dos produtos com `active = false` estão ausentes da listagem em qualquer estado de filtro.
- **SC-003**: Um visitante consegue reduzir a lista para uma categoria específica em no máximo 1 interação (um clique/toque).
- **SC-004**: 100% dos produtos com estoque zero permanecem visíveis na listagem com indicador de indisponibilidade, nunca ocultos.

## Assumptions

- A listagem exibe todos os produtos ativos de uma vez, sem paginação — volume inicial estimado de ~100 produtos é compatível com isso.
- Não há busca textual nesta versão; descoberta é apenas via navegação visual e filtro de categoria.
- O filtro de categoria permite seleção única (não múltipla) nesta versão.
- A ordenação padrão da listagem é por nome do produto, em ordem alfabética (decisão de apresentação, sem impacto de negócio).
- A página de detalhe do produto, destino da navegação do card, é especificada em uma feature separada.
