# Feature Specification: Gestão de Usuários Administrativos no Painel

**Feature Branch**: `010-admin-usuarios`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Gestão de usuários administrativos no painel da Nerta Brasil: apenas usuários com papel 'admin' (não 'editor') podem criar novos usuários administrativos (admin ou editor) e excluir usuários existentes. Não há autocadastro em nenhum lugar do sistema — toda conta administrativa nasce de uma criação feita por um admin existente. Um admin não pode excluir a própria conta (guard obrigatório, no backend e na interface). Esta feature assume que a autenticação do painel (admin-autenticacao) já existe como pré-requisito. Esta é uma das specs menores derivadas do escopo arquitetural geral definido em specs/001-vitrine-catalogo (que permanece como referência de arquitetura, não como spec de implementação)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar um novo usuário administrativo (Priority: P1)

Um usuário com papel 'admin' cria uma nova conta administrativa, definindo e-mail, senha inicial e papel (admin ou editor), e essa conta passa a poder ser usada para login.

**Why this priority**: É a única forma de qualquer conta administrativa entrar no sistema, já que não há autocadastro — sem essa operação, nenhuma equipe poderia crescer além do(s) admin(s) inicial(is) cadastrado(s) por seed/setup.

**Independent Test**: Pode ser testado isoladamente autenticando como um usuário 'admin' de seed, preenchendo o formulário de novo usuário, e verificando que a conta criada aparece na listagem de usuários e consegue fazer login com as credenciais definidas.

**Acceptance Scenarios**:

1. **Given** um usuário com papel 'admin' está autenticado, **When** ele cria um novo usuário informando e-mail, senha e papel, **Then** o novo usuário é criado e aparece na listagem de usuários administrativos.
2. **Given** um usuário com papel 'admin' tenta criar um usuário com e-mail já cadastrado, **When** ele submete o formulário, **Then** o sistema exibe um erro de duplicidade e o usuário não é criado.
3. **Given** um usuário com papel 'editor' está autenticado, **When** ele tenta acessar a tela de gestão de usuários, **Then** o acesso é negado, pois apenas 'admin' tem essa permissão.

---

### User Story 2 - Excluir um usuário administrativo existente (Priority: P1)

Um usuário com papel 'admin' exclui permanentemente a conta de outro usuário administrativo (admin ou editor), removendo seu acesso ao painel.

**Why this priority**: É o complemento necessário da criação — sem a capacidade de excluir, contas de ex-colaboradores ou criadas por erro permaneceriam ativas indefinidamente, um risco de segurança. Tem a mesma prioridade da criação por formarem juntas o ciclo básico de gestão de acesso.

**Independent Test**: Pode ser testado isoladamente autenticando como um usuário 'admin' de seed, excluindo outro usuário de teste, e verificando que a conta excluída não consegue mais fazer login.

**Acceptance Scenarios**:

1. **Given** um usuário com papel 'admin' está autenticado, **When** ele exclui outro usuário administrativo (admin ou editor) que não seja ele mesmo, **Then** a conta excluída é removida permanentemente e não consegue mais fazer login.
2. **Given** um usuário com papel 'admin' aciona a exclusão de outro usuário, **When** o modal de confirmação é exibido, **Then** ele mostra um scrim escuro e exige confirmação explícita antes de executar a exclusão.

---

### User Story 3 - Bloqueio de autoexclusão (Priority: P1)

Um usuário com papel 'admin' tenta excluir a própria conta e é impedido pelo sistema, tanto na interface quanto no backend.

**Why this priority**: É uma regra de negócio crítica e explícita do projeto, prevenindo que o painel administrativo fique sem nenhum admin acessível (um risco operacional severo). Tem prioridade máxima, igual à criação e exclusão de outros usuários.

**Independent Test**: Pode ser testado isoladamente autenticando como um usuário 'admin', tentando excluir a própria conta diretamente (inclusive contornando a interface, se possível, para validar o guard no backend), e verificando que a operação é sempre bloqueada.

**Acceptance Scenarios**:

1. **Given** um usuário com papel 'admin' está autenticado, **When** ele tenta excluir a própria conta pela interface, **Then** a opção de exclusão não está disponível ou é explicitamente bloqueada com uma mensagem clara.
2. **Given** uma tentativa de exclusão da própria conta é submetida diretamente ao backend (contornando a interface), **When** essa operação é processada, **Then** o sistema rejeita a exclusão, independentemente da origem da requisição.

---

### Edge Cases

- O que acontece quando o último usuário 'admin' do sistema tenta ser excluído por outro admin (em um cenário com múltiplos admins, um exclui o outro até restar só um)? O bloqueio de autoexclusão impede que um admin se exclua, mas não impede que um admin exclua outro — esta spec assume que a operação é permitida mesmo que reduza a contagem de admins a um, já que sempre restará ao menos um admin autenticado (ele mesmo) capaz de criar novos.
- O que acontece quando um usuário 'editor' tenta criar ou excluir outro usuário diretamente via ação de backend, contornando a interface? A operação deve ser rejeitada, pois apenas 'admin' tem essa permissão, verificada no backend.
- O que acontece quando o e-mail informado na criação de um novo usuário é inválido (formato incorreto)? O sistema deve rejeitar a submissão com um erro de validação claro.
- O que acontece com a sessão de um usuário que está autenticado no momento em que sua conta é excluída por um admin? Na próxima verificação de sessão/papel, o acesso deve ser negado e o usuário redirecionado para login, mesmo que seu token ainda não tenha expirado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que apenas usuários com papel 'admin' acessem a tela de gestão de usuários administrativos.
- **FR-002**: O sistema MUST permitir que um usuário 'admin' crie uma nova conta administrativa informando e-mail, senha inicial e papel ('admin' ou 'editor').
- **FR-003**: O sistema MUST impedir a criação de uma conta administrativa com e-mail já cadastrado, exibindo um erro de duplicidade.
- **FR-004**: O sistema MUST validar o formato do e-mail informado na criação de um novo usuário.
- **FR-005**: O sistema MUST permitir que um usuário 'admin' exclua permanentemente a conta de qualquer outro usuário administrativo (admin ou editor).
- **FR-006**: O sistema MUST exibir um modal de confirmação com scrim escuro antes de executar qualquer exclusão de usuário.
- **FR-007**: O sistema MUST impedir que um usuário 'admin' exclua a própria conta, tanto na interface (opção indisponível ou bloqueada) quanto no backend (rejeição da operação independentemente da origem).
- **FR-008**: O sistema MUST rejeitar, no backend, qualquer tentativa de criação ou exclusão de usuário administrativo originada por um usuário com papel 'editor' ou não autenticado.
- **FR-009**: O sistema MUST exibir, na tela de gestão, a listagem de todos os usuários administrativos cadastrados, com seu papel visível.
- **FR-010**: O sistema MUST NOT oferecer nenhum mecanismo de autocadastro em nenhum ponto do sistema — toda conta administrativa nasce exclusivamente da criação por um 'admin' existente.

### Key Entities

- **Usuário Administrativo**: Conta com acesso ao painel — e-mail (único), senha (gerenciada via mecanismo de autenticação), papel ('admin' ou 'editor', determina permissões incluindo acesso a esta própria tela).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das tentativas de um usuário 'admin' excluir a própria conta são bloqueadas, tanto na interface quanto no backend, sem exceção.
- **SC-002**: 100% das tentativas de criação ou exclusão de usuário por um usuário 'editor' ou não autenticado são rejeitadas no backend.
- **SC-003**: Um usuário 'admin' consegue criar uma nova conta administrativa válida em uma única submissão de formulário.
- **SC-004**: 100% das contas excluídas perdem a capacidade de autenticar imediatamente após a exclusão, mesmo com sessão ainda ativa no momento da exclusão.

## Assumptions

- A autenticação e proteção de rotas administrativas (spec 005-admin-autenticacao) já existe como pré-requisito; esta spec assume que o mecanismo de verificação de papel já está disponível para ser consumido aqui.
- Não há edição de papel ou senha de um usuário existente especificada nesta versão — apenas criação e exclusão; alteração de papel/senha, se necessária, seria tratada como extensão futura.
- O primeiro usuário 'admin' do sistema é criado fora do fluxo desta feature (seed inicial/setup), já que esta feature exige um 'admin' autenticado para criar qualquer outro usuário.
- Exclusão de usuário é uma operação destrutiva e permanente, sem soft-delete ou reativação nesta versão.
