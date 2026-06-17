# Feature Specification: Home / Landing Institucional

**Feature Branch**: `004-home-landing`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Página inicial (home) da Nerta Brasil: landing institucional que apresenta a marca (química automotiva premium belga, distribuída pela Provisão) e direciona o visitante para o catálogo de produtos. A home exibe um carrossel/seção de produtos em destaque (apenas produtos ativos marcados como featured), uma seção institucional curta sobre a marca, e chamadas para ação que levam ao catálogo completo. Não há login, carrinho ou qualquer fluxo de conta de usuário final. Esta é uma das specs menores derivadas do escopo arquitetural geral definido em specs/001-vitrine-catalogo (que permanece como referência de arquitetura, não como spec de implementação)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conhecer a marca e ser direcionado ao catálogo (Priority: P1)

Um visitante que chega à home pela primeira vez entende rapidamente o que é a Nerta Brasil (química automotiva premium belga) e encontra um caminho claro para ver os produtos disponíveis.

**Why this priority**: É a primeira impressão da marca e o principal ponto de entrada de tráfego orgânico/SEO — sem uma home funcional que comunique a proposta de valor e direcione ao catálogo, o restante da vitrine perde alcance.

**Independent Test**: Pode ser testado isoladamente acessando a home e verificando que a seção institucional está presente e que existe ao menos um caminho de navegação (link/botão) que leva à página de catálogo, sem depender de produtos em destaque estarem cadastrados.

**Acceptance Scenarios**:

1. **Given** um visitante acessa a home, **When** a página carrega, **Then** uma seção institucional curta sobre a marca é exibida.
2. **Given** um visitante está na home, **When** ele aciona uma chamada para ação voltada ao catálogo, **Then** ele é direcionado à página de catálogo completo.

---

### User Story 2 - Ver produtos em destaque na home (Priority: P2)

Um visitante vê, já na home, uma seleção de produtos em destaque escolhidos pela administração, podendo navegar diretamente para algum desses produtos sem precisar passar pelo catálogo completo.

**Why this priority**: Acelera a descoberta de produtos estratégicos e aumenta a chance de conversão para o Mercado Livre, mas a home já entrega valor sem essa seção (P1 cobre o caminho institucional + catálogo) — por isso é a segunda prioridade.

**Independent Test**: Pode ser testado isoladamente cadastrando produtos de seed com `featured = true` e `active = true`, acessando a home, e verificando que apenas esses produtos aparecem na seção de destaques, cada um navegável para sua página de detalhe.

**Acceptance Scenarios**:

1. **Given** existem produtos ativos marcados como destaque, **When** o visitante acessa a home, **Then** esses produtos são exibidos em uma seção de destaques, cada um levando à sua página de detalhe ao ser clicado.
2. **Given** um produto é marcado como destaque mas está inativo, **When** o visitante acessa a home, **Then** esse produto não aparece na seção de destaques.
3. **Given** nenhum produto ativo está marcado como destaque, **When** o visitante acessa a home, **Then** a seção de destaques não é exibida (ou exibe um estado neutro), sem erro na página.

---

### Edge Cases

- O que acontece quando não existe nenhum produto em destaque cadastrado? A seção de destaques é omitida ou substituída por um estado neutro, sem quebrar o layout da home nem exibir erro.
- O que acontece quando um produto em destaque é excluído ou desativado enquanto a home está em cache/exibida? Na próxima carga da página, ele simplesmente não aparece mais — não há expectativa de atualização em tempo real.
- O que acontece quando o visitante acessa a home diretamente por um mecanismo de busca (sem ter navegado por outra página antes)? A home deve funcionar como ponto de entrada autônomo, sem depender de estado de navegação anterior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir, na home, uma seção institucional que apresenta a marca Nerta Brasil.
- **FR-002**: O sistema MUST exibir, na home, ao menos uma chamada para ação que direcione o visitante à página de catálogo completo.
- **FR-003**: O sistema MUST exibir, na home, apenas produtos que estejam simultaneamente ativos e marcados como destaque.
- **FR-004**: O sistema MUST tornar cada produto exibido na seção de destaques um ponto de navegação para sua respectiva página de detalhe.
- **FR-005**: O sistema MUST lidar com a ausência de produtos em destaque sem exibir erro, omitindo a seção ou exibindo um estado neutro.
- **FR-006**: O sistema MUST permitir o acesso à home sem exigir nenhuma ação de autenticação do visitante.
- **FR-007**: O sistema MUST NOT exibir qualquer elemento de carrinho, checkout ou login de usuário final na home.

### Key Entities

- **Produto (visão de destaque)**: Subconjunto de produtos exibido na home — nome, imagem de capa, e flags `active`/`featured` que determinam sua elegibilidade para esta seção.
- **Conteúdo Institucional**: Texto e imagens curtos que apresentam a marca; não é uma entidade de banco de dados, é conteúdo da própria página.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante consegue carregar a home e visualizar a seção institucional em até 2 segundos após o acesso, em condições normais de rede.
- **SC-002**: Um visitante consegue chegar à página de catálogo a partir da home em no máximo 1 interação (um clique/toque).
- **SC-003**: 100% dos produtos exibidos na seção de destaques atendem simultaneamente aos critérios `active = true` e `featured = true`.
- **SC-004**: 100% dos acessos à home, com ou sem produtos em destaque cadastrados, resultam em uma página funcional, sem erro.

## Assumptions

- A curadoria de quais produtos são "destaque" (flag `featured`) é feita pela feature de administração de destaques (fora de escopo aqui); esta spec apenas consome essa flag.
- O conteúdo institucional (texto sobre a marca) é estático/editorial nesta versão — não há um painel de edição de conteúdo da home fora de escopo aqui.
- Não há limite mínimo de produtos em destaque para a seção ser exibida; o limite máximo de itens exibidos (se houver) é uma decisão de apresentação, sem impacto de negócio.
- A home não exibe filtro por categoria nem busca — esses recursos pertencem à página de catálogo (spec 002-catalogo-publico).
