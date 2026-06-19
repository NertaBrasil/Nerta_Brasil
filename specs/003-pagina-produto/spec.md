# Feature Specification: Página de Detalhe do Produto

**Feature Branch**: `003-pagina-produto`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Página de detalhe do produto da Nerta Brasil: uma página individual, indexável e com URL própria (slug do produto), que exibe todas as informações de um produto específico — galeria de imagens (1:1), nome, linha comercial, descrição completa, ficha técnica/especificações, indicador de disponibilidade (estoque), categoria, e o botão 'Comprar no Mercado Livre' que abre em nova aba e dispara eventos de analytics (GA4 + Meta Pixel) no clique. Se o produto tiver estoque zerado, o botão de compra fica desabilitado e exibe texto 'Produto Indisponível', sem link algum. Se o produto estiver inativo ou não existir (slug inválido), a página retorna 404. O visitante chega a esta página principalmente a partir de um card no catálogo público (spec 002-catalogo-publico) ou diretamente via link/SEO. Esta feature não inclui produtos relacionados/recomendados nem comentários/avaliações. Esta é uma das specs menores derivadas do escopo arquitetural geral definido em specs/001-vitrine-catalogo (que permanece como referência de arquitetura, não como spec de implementação)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver detalhes completos de um produto (Priority: P1)

Um visitante chega à página de um produto específico (vindo do catálogo ou de um link direto) e vê todas as informações necessárias para decidir se quer comprar: galeria de imagens, nome, linha comercial, descrição completa, ficha técnica e categoria.

**Why this priority**: É a função central da página — sem ela, não há razão para a página existir. Toda a decisão de compra do visitante depende dessas informações estarem completas e corretas.

**Independent Test**: Pode ser testado isoladamente acessando diretamente a URL de um produto ativo de seed e verificando que todas as informações esperadas aparecem corretamente, sem depender da navegação a partir do catálogo.

**Acceptance Scenarios**:

1. **Given** existe um produto ativo com slug válido, **When** o visitante acessa a URL desse produto, **Then** a página exibe galeria de imagens, nome, linha comercial, descrição completa, ficha técnica e categoria do produto.
2. **Given** um produto tem múltiplas imagens cadastradas, **When** o visitante visualiza a página, **Then** a galeria permite visualizar todas as imagens do produto, todas em proporção 1:1.
3. **Given** um produto não possui nenhuma imagem cadastrada, **When** o visitante visualiza a página, **Then** a galeria exibe um placeholder visual no lugar das imagens, sem quebrar o layout.

---

### User Story 2 - Seguir para a compra no Mercado Livre (Priority: P1)

Um visitante decidido a comprar clica no botão "Comprar no Mercado Livre" e é levado, em uma nova aba, ao anúncio correspondente, enquanto o sistema registra esse interesse para fins de analytics.

**Why this priority**: É o objetivo de negócio de toda a vitrine — a página de produto só gera valor real quando converte em um clique de saída para o Mercado Livre. Tem a mesma prioridade da User Story 1 porque uma página de produto sem esse botão funcional não cumpre seu propósito.

**Independent Test**: Pode ser testado isoladamente em um produto com estoque disponível, verificando que o clique no botão abre a URL do Mercado Livre em nova aba e dispara os eventos de analytics esperados, sem depender de nenhuma outra feature.

**Acceptance Scenarios**:

1. **Given** um produto ativo tem estoque disponível, **When** o visitante clica em "Comprar no Mercado Livre", **Then** uma nova aba é aberta com a URL do anúncio do produto e eventos de analytics (GA4 e Meta Pixel) são disparados.
2. **Given** um produto ativo tem estoque zerado, **When** o visitante visualiza a página, **Then** o botão de compra aparece desabilitado, exibindo o texto "Produto Indisponível", sem nenhum link associado.

---

### User Story 3 - Tratamento de produto inexistente ou inativo (Priority: P2)

Um visitante acessa uma URL de produto que não existe (slug inválido) ou que corresponde a um produto desativado, e recebe uma página de erro 404 clara, sem vazamento de informação sobre produtos inativos.

**Why this priority**: É essencial para integridade do catálogo público e SEO (evitar páginas fantasmas indexadas), mas depende logicamente das User Stories 1 e 2 já existirem como o "caminho feliz" — por isso é tratada como a segunda prioridade.

**Independent Test**: Pode ser testado isoladamente acessando uma URL com slug inexistente e, separadamente, a URL de um produto com `active = false`, verificando em ambos os casos que a resposta é 404.

**Acceptance Scenarios**:

1. **Given** não existe nenhum produto com o slug informado na URL, **When** o visitante acessa essa URL, **Then** a página retorna 404.
2. **Given** existe um produto com o slug informado, mas `active = false`, **When** o visitante acessa essa URL, **Then** a página retorna 404, da mesma forma que um slug inexistente.

---

### Edge Cases

- O que acontece quando o produto não tem ficha técnica/especificações cadastradas? A seção correspondente é omitida ou exibida vazia, sem quebrar o layout nem exibir erro.
- O que acontece quando um produto pertence a uma categoria que foi excluída (órfão)? A página exibe as demais informações do produto normalmente, sem exibir uma categoria inválida ou quebrar.
- O que acontece quando o link de destino no Mercado Livre está ausente para um produto com estoque disponível? O botão deve se comportar como indisponível (desabilitado), já que não há destino válido para o clique.
- O que acontece quando o visitante acessa a página por um slug com capitalização ou formatação diferente da cadastrada? A busca pelo produto deve ser exata por slug; variações não correspondentes resultam em 404.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir uma página individual para cada produto ativo, acessível por uma URL própria baseada no slug do produto.
- **FR-002**: O sistema MUST exibir, na página do produto, ao menos: galeria de imagens (proporção 1:1), nome, linha comercial, descrição completa, ficha técnica/especificações (quando existentes) e categoria.
- **FR-003**: O sistema MUST exibir um botão "Comprar no Mercado Livre" que, quando o produto tem estoque disponível e link de destino válido, abre esse link em nova aba ao ser clicado.
- **FR-004**: O sistema MUST disparar eventos de analytics (GA4 e Meta Pixel) no momento do clique no botão de compra.
- **FR-005**: O sistema MUST desabilitar o botão de compra e exibir o texto "Produto Indisponível", sem nenhum link associado, quando o estoque do produto é zero ou quando não há link de destino válido.
- **FR-006**: O sistema MUST retornar uma resposta 404 quando o slug acessado não corresponder a nenhum produto cadastrado.
- **FR-007**: O sistema MUST retornar uma resposta 404 quando o slug acessado corresponder a um produto com status inativo, tratando-o como inexistente para o visitante.
- **FR-008**: O sistema MUST exibir um placeholder visual na galeria quando o produto não possuir nenhuma imagem cadastrada.
- **FR-009**: O sistema MUST permitir o acesso à página do produto sem exigir nenhuma ação de autenticação do visitante.

### Key Entities

- **Produto (visão de detalhe)**: Representa o item exibido nesta página — nome, linha comercial, descrição completa, ficha técnica/especificações, galeria de imagens (ordenada, com uma imagem principal), indicador de disponibilidade (derivado do estoque), categoria associada (pode estar ausente/órfã), link de destino no Mercado Livre, slug único e status ativo/inativo (controla se a página responde 404).
- **Categoria**: Agrupamento exibido como metadado do produto nesta página; não controla nenhum comportamento de filtro aqui (isso pertence à spec do catálogo).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante consegue visualizar todas as informações principais de um produto em até 2 segundos após acessar a URL, em condições normais de rede.
- **SC-002**: 100% dos acessos a slugs inexistentes ou de produtos inativos resultam em resposta 404, sem exceção.
- **SC-003**: 100% dos cliques no botão de compra em produtos com estoque disponível resultam tanto na abertura da nova aba quanto no disparo dos eventos de analytics.
- **SC-004**: 100% dos produtos com estoque zero exibem o botão desabilitado com o texto "Produto Indisponível", nunca um link clicável.

## Assumptions

- O link de destino no Mercado Livre é um campo já cadastrado no produto (gerenciado pela feature de administração de produtos, fora de escopo aqui).
- Esta feature não inclui produtos relacionados/recomendados, comentários ou avaliações.
- A galeria de imagens e sua ordenação (incluindo qual é a "principal") são definidas pela feature de administração de imagens (fora de escopo aqui); esta spec apenas consome essa ordenação.
- A página é majoritariamente estática do ponto de vista de interatividade — a única ação do visitante além da navegação é o clique no botão de compra.
- SEO (indexação, metadados) é uma preocupação implícita da página, dado que o catálogo (spec 002) trata o detalhe do produto como destino de navegação principal.
