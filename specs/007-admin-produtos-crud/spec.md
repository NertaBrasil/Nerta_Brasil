# Feature Specification: Gestão de Produtos (CRUD) no Painel Administrativo

**Feature Branch**: `007-admin-produtos-crud`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Gestão de produtos (cadastro, edição, exclusão e ativação/desativação) no painel administrativo da Nerta Brasil: usuários admin/editor autenticados podem criar, editar e excluir produtos. Cada produto tem nome, slug (gerado automaticamente, editável), linha comercial, descrição curta, descrição completa, ficha técnica, categoria, estoque (número, controla disponibilidade), status ativo/inativo, link de destino no Mercado Livre. Esta feature NÃO inclui o gerenciamento de imagens de produto (galeria, crop, upload) — isso é uma feature separada (admin-produtos-imagens). Produtos inativos não aparecem na vitrine pública mas continuam visíveis e editáveis no admin. Esta feature assume que a autenticação do painel (admin-autenticacao) e a gestão de categorias (admin-categorias) já existem como pré-requisitos. Esta é uma das specs menores derivadas do escopo arquitetural geral definido em specs/001-vitrine-catalogo (que permanece como referência de arquitetura, não como spec de implementação)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastrar um novo produto (Priority: P1)

Um usuário administrativo autenticado cadastra um novo produto preenchendo nome, linha comercial, descrições, ficha técnica, categoria, estoque, status e link de destino, e o produto passa a existir no sistema.

**Why this priority**: É a operação fundamental que viabiliza todo o catálogo — sem cadastro de produtos, não há vitrine pública nem nenhuma das demais features de gestão de produto.

**Independent Test**: Pode ser testado isoladamente autenticando como admin/editor, preenchendo o formulário de novo produto com uma categoria existente, e verificando que o produto criado aparece na listagem administrativa com todos os dados corretos.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado preenche todos os campos obrigatórios de um novo produto com uma categoria existente, **When** ele salva o formulário, **Then** o produto é criado com um slug gerado automaticamente a partir do nome.
2. **Given** um usuário está criando um produto, **When** ele edita manualmente o slug sugerido antes de salvar, **Then** o produto é criado com o slug customizado informado.
3. **Given** um usuário tenta criar um produto sem informar um campo obrigatório (ex: nome ou categoria), **When** ele submete o formulário, **Then** o sistema exibe um erro de validação e o produto não é criado.
4. **Given** um usuário tenta criar um produto com slug já usado por outro produto existente, **When** ele submete o formulário, **Then** o sistema exibe um erro de duplicidade e o produto não é criado.

---

### User Story 2 - Editar um produto existente (Priority: P1)

Um usuário administrativo autenticado altera qualquer atributo de um produto já cadastrado (nome, descrições, ficha técnica, categoria, estoque, status, link), e as mudanças passam a refletir imediatamente na vitrine pública (quando aplicável).

**Why this priority**: Produtos precisam de atualização constante (preço indireto via estoque, descrições, categoria) — sem edição funcional, o catálogo rapidamente fica desatualizado. Tem a mesma prioridade do cadastro porque ambos formam o ciclo básico de manutenção do catálogo.

**Independent Test**: Pode ser testado isoladamente com um produto de seed já existente, editando seu nome e estoque, e verificando que as alterações refletem na listagem administrativa e, se o produto estiver ativo, na vitrine pública.

**Acceptance Scenarios**:

1. **Given** um produto existente, **When** um usuário autenticado altera seu estoque para zero e salva, **Then** o produto passa a ser exibido como indisponível na vitrine pública, sem deixar de aparecer na listagem.
2. **Given** um produto existente, **When** um usuário autenticado altera sua categoria para outra categoria existente, **Then** o produto passa a ser classificado pela nova categoria em todos os filtros do catálogo público.
3. **Given** um produto existente, **When** um usuário autenticado tenta salvar um slug que já pertence a outro produto, **Then** o sistema exibe um erro de duplicidade e a alteração não é salva.

---

### User Story 3 - Ativar ou desativar um produto (Priority: P1)

Um usuário administrativo autenticado alterna o status de um produto entre ativo e inativo, controlando sua visibilidade na vitrine pública sem precisar excluí-lo.

**Why this priority**: É a forma principal de remover temporariamente um produto da vitrine (ex: descontinuado, fora de linha) sem perder seu histórico/dados — uma operação tão frequente quanto criar ou editar, por isso compartilha a prioridade máxima.

**Independent Test**: Pode ser testado isoladamente com um produto ativo de seed, desativando-o, e verificando que ele desaparece da vitrine pública mas permanece visível e editável no admin.

**Acceptance Scenarios**:

1. **Given** um produto está ativo, **When** um usuário autenticado o desativa, **Then** o produto deixa de aparecer na vitrine pública (catálogo, home, página de detalhe), mas continua visível e editável no painel administrativo.
2. **Given** um produto está inativo, **When** um usuário autenticado o reativa, **Then** o produto volta a aparecer na vitrine pública normalmente.

---

### User Story 4 - Excluir um produto (Priority: P2)

Um usuário administrativo autenticado exclui permanentemente um produto que não é mais necessário no sistema.

**Why this priority**: É uma operação de limpeza definitiva, menos frequente que desativação (que é reversível) — produtos descontinuados normalmente são apenas desativados, então exclusão tem prioridade menor.

**Independent Test**: Pode ser testado isoladamente criando um produto de teste, excluindo-o, e verificando que ele desaparece completamente da listagem administrativa e de qualquer ponto da vitrine pública.

**Acceptance Scenarios**:

1. **Given** um produto existente, **When** um usuário autenticado confirma sua exclusão, **Then** o produto é removido permanentemente e não aparece mais em nenhuma listagem, pública ou administrativa.
2. **Given** um usuário aciona a exclusão de um produto, **When** o modal de confirmação é exibido, **Then** ele mostra um scrim escuro e exige confirmação explícita antes de executar a exclusão.

---

### Edge Cases

- O que acontece quando um usuário tenta cadastrar ou editar um produto selecionando uma categoria que foi excluída entre o carregamento do formulário e a submissão? O sistema deve rejeitar a submissão com um erro claro, pedindo que uma categoria válida seja selecionada novamente.
- O que acontece quando o estoque informado é um número negativo? O sistema deve rejeitar a submissão, pois estoque é uma quantidade não-negativa.
- O que acontece quando um produto inativo é editado e seu estoque muda de zero para um valor positivo? O produto permanece inativo (invisível na vitrine) até ser explicitamente reativado — status e estoque são controles independentes.
- O que acontece quando um produto excluído possui imagens cadastradas (galeria, fora de escopo aqui)? Essas imagens devem ser removidas/desvinculadas como consequência da exclusão do produto, ainda que o gerenciamento da galeria em si seja de outra feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que um usuário administrativo autenticado cadastre um novo produto informando nome, linha comercial, descrição curta, descrição completa, ficha técnica, categoria, estoque, status (ativo/inativo) e link de destino no Mercado Livre.
- **FR-002**: O sistema MUST gerar automaticamente um slug a partir do nome do produto ao criá-lo, permitindo edição manual desse slug antes de salvar.
- **FR-003**: O sistema MUST impedir a criação ou edição de um produto cujo slug já pertença a outro produto existente, exibindo um erro de duplicidade.
- **FR-004**: O sistema MUST exigir que todo produto esteja vinculado a uma categoria existente e válida no momento da criação ou edição.
- **FR-005**: O sistema MUST validar que o valor de estoque informado é um número inteiro não-negativo.
- **FR-006**: O sistema MUST permitir que um usuário administrativo autenticado edite qualquer atributo de um produto existente.
- **FR-007**: O sistema MUST permitir que um usuário administrativo autenticado alterne o status de um produto entre ativo e inativo de forma independente do valor de estoque.
- **FR-008**: O sistema MUST ocultar produtos inativos de toda a vitrine pública, mantendo-os visíveis e editáveis no painel administrativo.
- **FR-009**: O sistema MUST permitir que um usuário administrativo autenticado exclua permanentemente um produto, mediante confirmação em modal com scrim escuro.
- **FR-010**: O sistema MUST exibir, no painel administrativo, uma listagem de todos os produtos cadastrados, independentemente de seu status ativo/inativo.
- **FR-011**: O sistema MUST restringir todas as operações de gestão de produtos (criar, editar, ativar/desativar, excluir) a usuários autenticados com papel administrativo válido.
- **FR-012**: O sistema MUST NOT incluir, nesta feature, o gerenciamento de imagens de produto (upload, crop, galeria, ordenação) — esse escopo pertence a uma feature separada.

### Key Entities

- **Produto**: Item central do catálogo — nome, slug (único, editável), linha comercial, descrição curta, descrição completa, ficha técnica/especificações, categoria (referência obrigatória), estoque (inteiro não-negativo, deriva o indicador de disponibilidade), status ativo/inativo (controla visibilidade pública), link de destino no Mercado Livre.
- **Categoria (referência)**: Consumida por esta feature como uma lista de opções válidas para classificar o produto; sua gestão pertence à feature admin-categorias (fora de escopo aqui).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário administrativo consegue cadastrar um produto completo e válido em uma única submissão de formulário, sem precisar corrigir múltiplas vezes por falta de validação clara.
- **SC-002**: 100% dos produtos com status inativo estão ausentes de toda a vitrine pública, verificável a qualquer momento após a alteração de status.
- **SC-003**: 100% das tentativas de criar ou editar produtos com slug duplicado ou categoria inválida são rejeitadas antes de persistir qualquer alteração.
- **SC-004**: Um usuário administrativo consegue alternar o status de um produto (ativar/desativar) em no máximo 1 interação principal (um clique/toggle) além da confirmação, quando aplicável.

## Assumptions

- A autenticação e proteção de rotas administrativas (spec 005-admin-autenticacao) e a gestão de categorias (spec 006-admin-categorias) já existem como pré-requisitos.
- O gerenciamento de imagens de produto (upload, crop 1:1, galeria, reordenação) é tratado integralmente pela feature admin-produtos-imagens, fora de escopo aqui; um produto pode existir temporariamente sem nenhuma imagem.
- A flag `featured` (produto em destaque na home) é gerenciada pela feature admin-destaques, fora de escopo aqui; esta spec apenas garante que o campo de status ativo/inativo e estoque funcionem corretamente como pré-requisitos para essa outra feature.
- Tanto o papel 'admin' quanto 'editor' têm permissão para gerenciar produtos nesta versão.
- Exclusão de produto é uma operação destrutiva e permanente, sem soft-delete ou lixeira nesta versão.
