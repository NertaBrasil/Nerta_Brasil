# Feature Specification: Gestão de Categorias no Painel Administrativo

**Feature Branch**: `006-admin-categorias`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Gestão de categorias de produtos no painel administrativo da Nerta Brasil: usuários admin/editor autenticados podem criar, editar e excluir categorias usadas para classificar produtos no catálogo público. Cada categoria tem nome e slug (gerado automaticamente a partir do nome, mas editável). Excluir uma categoria com produtos vinculados é bloqueado — o sistema deve avisar e pedir reclassificação dos produtos antes de permitir a exclusão. Esta feature assume que a autenticação do painel (admin-autenticacao) já existe como pré-requisito. Esta é uma das specs menores derivadas do escopo arquitetural geral definido em specs/001-vitrine-catalogo (que permanece como referência de arquitetura, não como spec de implementação)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar uma nova categoria (Priority: P1)

Um usuário administrativo autenticado cria uma nova categoria informando um nome, e o sistema gera automaticamente um slug a partir desse nome, podendo o usuário ajustá-lo antes de salvar.

**Why this priority**: Sem a capacidade de criar categorias, não há como classificar produtos no catálogo — é a operação fundamental que viabiliza todo o restante da gestão de categorias e, por extensão, o filtro do catálogo público.

**Independent Test**: Pode ser testado isoladamente autenticando como admin/editor, preenchendo o formulário de nova categoria, e verificando que a categoria criada aparece na listagem de categorias com nome e slug corretos.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado preenche o nome de uma nova categoria, **When** ele salva o formulário, **Then** a categoria é criada com um slug gerado automaticamente a partir do nome.
2. **Given** um usuário autenticado está criando uma categoria, **When** ele edita manualmente o slug sugerido antes de salvar, **Then** a categoria é criada com o slug customizado informado.
3. **Given** um usuário tenta criar uma categoria com nome ou slug já usados por outra categoria existente, **When** ele submete o formulário, **Then** o sistema exibe um erro de duplicidade e a categoria não é criada.

---

### User Story 2 - Editar uma categoria existente (Priority: P2)

Um usuário administrativo autenticado altera o nome e/ou slug de uma categoria já existente, e a mudança se reflete em todos os produtos vinculados a ela.

**Why this priority**: É necessário para corrigir erros e ajustar nomenclatura ao longo do tempo, mas o catálogo já é funcional com categorias criadas corretamente desde o início (P1) — por isso é a segunda prioridade.

**Independent Test**: Pode ser testado isoladamente com uma categoria de seed já existente, editando seu nome, e verificando que a alteração é refletida na listagem de categorias e nos produtos vinculados a ela.

**Acceptance Scenarios**:

1. **Given** uma categoria existente, **When** um usuário autenticado altera seu nome e salva, **Then** a categoria passa a refletir o novo nome em toda a interface administrativa e no catálogo público.
2. **Given** uma categoria existente, **When** um usuário autenticado tenta salvar um slug que já pertence a outra categoria, **Then** o sistema exibe um erro de duplicidade e a alteração não é salva.

---

### User Story 3 - Excluir uma categoria sem produtos vinculados (Priority: P2)

Um usuário administrativo autenticado exclui uma categoria que não possui nenhum produto vinculado, removendo-a permanentemente do sistema.

**Why this priority**: Mantém a organização do catálogo limpa ao longo do tempo, mas não é uma operação crítica para o funcionamento diário — por isso compartilha prioridade com a edição.

**Independent Test**: Pode ser testado isoladamente criando uma categoria sem produtos vinculados, excluindo-a, e verificando que ela desaparece da listagem.

**Acceptance Scenarios**:

1. **Given** uma categoria sem nenhum produto vinculado, **When** um usuário autenticado confirma sua exclusão, **Then** a categoria é removida permanentemente e não aparece mais na listagem.
2. **Given** uma categoria sem produtos vinculados, **When** um usuário aciona a exclusão, **Then** o sistema exibe um modal de confirmação com scrim escuro antes de executar a exclusão.

---

### User Story 4 - Tentar excluir categoria com produtos vinculados (Priority: P1)

Um usuário administrativo autenticado tenta excluir uma categoria que possui produtos vinculados e é impedido, recebendo uma mensagem clara de que precisa reclassificar os produtos antes.

**Why this priority**: É uma regra de negócio crítica e explícita do projeto — sua ausência permitiria a criação de produtos órfãos em massa, quebrando a integridade do catálogo. Por isso tem prioridade máxima, igual à criação.

**Independent Test**: Pode ser testado isoladamente com uma categoria de seed vinculada a ao menos um produto, tentando excluí-la, e verificando que a exclusão é bloqueada com uma mensagem explicativa.

**Acceptance Scenarios**:

1. **Given** uma categoria possui ao menos um produto vinculado, **When** um usuário autenticado tenta excluí-la, **Then** o sistema bloqueia a exclusão e exibe uma mensagem informando que é necessário reclassificar os produtos vinculados antes.
2. **Given** uma categoria teve todos os seus produtos reclassificados para outras categorias, **When** um usuário autenticado tenta excluí-la novamente, **Then** a exclusão é permitida normalmente.

---

### Edge Cases

- O que acontece quando dois usuários administrativos tentam criar categorias com o mesmo nome simultaneamente? A segunda submissão a chegar ao sistema deve falhar com erro de duplicidade, mantendo unicidade de nome/slug.
- O que acontece quando o nome de uma categoria gera um slug vazio ou inválido (ex: apenas caracteres especiais)? O sistema deve impedir a criação/edição até que um slug válido seja informado.
- O que acontece quando um usuário autenticado com papel 'editor' tenta gerenciar categorias? Esta spec assume que tanto 'admin' quanto 'editor' têm permissão de gerenciar categorias, salvo indicação contrária da feature de usuários.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que um usuário administrativo autenticado (admin ou editor) crie uma nova categoria informando um nome.
- **FR-002**: O sistema MUST gerar automaticamente um slug a partir do nome da categoria ao criá-la, permitindo edição manual desse slug antes de salvar.
- **FR-003**: O sistema MUST impedir a criação ou edição de uma categoria cujo nome ou slug já pertença a outra categoria existente, exibindo um erro de duplicidade.
- **FR-004**: O sistema MUST permitir que um usuário administrativo autenticado edite o nome e/ou slug de uma categoria existente.
- **FR-005**: O sistema MUST permitir que um usuário administrativo autenticado exclua uma categoria que não possua nenhum produto vinculado.
- **FR-006**: O sistema MUST exibir um modal de confirmação com scrim escuro antes de executar qualquer exclusão de categoria.
- **FR-007**: O sistema MUST bloquear a exclusão de uma categoria que possua ao menos um produto vinculado, exibindo uma mensagem explicando que os produtos precisam ser reclassificados antes.
- **FR-008**: O sistema MUST exibir, no painel administrativo, a listagem de todas as categorias cadastradas, independentemente de terem produtos vinculados ou não.
- **FR-009**: O sistema MUST restringir a gestão de categorias (criar, editar, excluir) a usuários autenticados com papel administrativo válido.

### Key Entities

- **Categoria**: Agrupamento de produtos — nome, slug (único, editável, gerado a partir do nome), e contagem/referência implícita de produtos vinculados (usada para decidir se a exclusão é permitida).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário administrativo consegue criar uma categoria válida em até 1 submissão de formulário, sem precisar preencher o slug manualmente na maioria dos casos.
- **SC-002**: 100% das tentativas de exclusão de categorias com produtos vinculados são bloqueadas, sem exceção.
- **SC-003**: 100% das categorias criadas ou editadas com nome/slug duplicado são rejeitadas antes de persistir qualquer alteração.
- **SC-004**: Um usuário administrativo consegue visualizar a listagem completa de categorias em até 2 segundos após acessar a tela correspondente.

## Assumptions

- A autenticação e proteção de rotas administrativas (spec 005-admin-autenticacao) já existe como pré-requisito; esta spec não reimplementa login ou guarda de sessão.
- Tanto o papel 'admin' quanto 'editor' têm permissão para gerenciar categorias nesta versão; restrições mais finas de permissão, se necessárias, seriam tratadas pela feature de usuários.
- Não há hierarquia de categorias (subcategorias) nesta versão — é uma lista plana.
- A reclassificação de produtos mencionada como pré-requisito para exclusão é realizada através da feature de administração de produtos (fora de escopo aqui); esta spec apenas impõe o bloqueio e a mensagem.
