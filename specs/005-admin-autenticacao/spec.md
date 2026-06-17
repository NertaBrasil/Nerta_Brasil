# Feature Specification: Autenticação do Painel Administrativo

**Feature Branch**: `005-admin-autenticacao`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Autenticação do painel administrativo da Nerta Brasil: login restrito para usuários administradores (papéis 'admin' e 'editor'), proteção de todas as rotas /admin/* contra acesso não autenticado, e logout. Não há autocadastro — apenas um admin existente cria novos usuários (essa criação de usuários é uma feature separada, fora de escopo aqui). Um usuário não autenticado que tenta acessar qualquer rota administrativa é redirecionado para a tela de login. Após login, o usuário é redirecionado para a área administrativa. Esta é uma das specs menores derivadas do escopo arquitetural geral definido em specs/001-vitrine-catalogo (que permanece como referência de arquitetura, não como spec de implementação)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login de usuário administrativo (Priority: P1)

Um usuário administrativo (admin ou editor) acessa a tela de login, informa suas credenciais e é autenticado, ganhando acesso à área administrativa.

**Why this priority**: É o pré-requisito absoluto para qualquer outra funcionalidade administrativa existir — sem login funcional, nenhuma feature do painel pode ser usada.

**Independent Test**: Pode ser testado isoladamente com um usuário de seed já cadastrado, acessando a tela de login, informando credenciais válidas, e verificando que o acesso à área administrativa é concedido.

**Acceptance Scenarios**:

1. **Given** um usuário administrativo cadastrado e credenciais válidas, **When** ele submete o formulário de login, **Then** ele é autenticado e redirecionado para a área administrativa.
2. **Given** credenciais inválidas (senha incorreta ou usuário inexistente), **When** o usuário submete o formulário de login, **Then** o sistema exibe uma mensagem de erro clara, sem indicar especificamente qual campo está incorreto, e o usuário permanece na tela de login.

---

### User Story 2 - Proteção de rotas administrativas (Priority: P1)

Um visitante não autenticado tenta acessar diretamente qualquer URL dentro da área administrativa e é impedido, sendo redirecionado para a tela de login.

**Why this priority**: É a garantia de segurança fundamental do painel — sem essa proteção, dados e operações administrativas ficariam expostos publicamente. Tem a mesma prioridade do login porque ambos juntos formam o perímetro de segurança mínimo viável.

**Independent Test**: Pode ser testado isoladamente, sem estar autenticado, acessando diretamente qualquer URL administrativa e verificando que o redirecionamento para login ocorre antes de qualquer conteúdo administrativo ser exibido.

**Acceptance Scenarios**:

1. **Given** um visitante não está autenticado, **When** ele acessa diretamente qualquer URL dentro da área administrativa, **Then** ele é redirecionado para a tela de login, sem ver nenhum conteúdo administrativo.
2. **Given** um usuário está autenticado, **When** ele acessa uma URL dentro da área administrativa, **Then** o conteúdo correspondente é exibido normalmente.

---

### User Story 3 - Logout (Priority: P2)

Um usuário administrativo autenticado aciona o logout e sua sessão é encerrada, retornando ao comportamento de visitante não autenticado.

**Why this priority**: É importante para higiene de segurança (especialmente em dispositivos compartilhados), mas o painel já é funcional e seguro sem essa ação explícita enquanto a sessão expira naturalmente — por isso é a segunda prioridade.

**Independent Test**: Pode ser testado isoladamente estando autenticado, acionando o logout, e verificando que uma tentativa subsequente de acessar uma rota administrativa redireciona novamente para login.

**Acceptance Scenarios**:

1. **Given** um usuário está autenticado na área administrativa, **When** ele aciona o logout, **Then** sua sessão é encerrada e ele é redirecionado para a tela de login.
2. **Given** um usuário acabou de fazer logout, **When** ele tenta acessar novamente uma URL administrativa, **Then** ele é redirecionado para a tela de login, como qualquer visitante não autenticado.

---

### Edge Cases

- O que acontece quando um usuário autenticado tem sua conta excluída por outro admin enquanto sua sessão ainda está ativa? Na próxima ação que exija verificação de sessão/papel, o acesso deve ser negado e o usuário redirecionado para login.
- O que acontece quando o usuário tenta acessar a tela de login já estando autenticado? Ele é redirecionado diretamente para a área administrativa, sem precisar logar novamente.
- O que acontece quando há múltiplas tentativas de login com credenciais inválidas em sequência? O sistema deve continuar exibindo a mensagem de erro genérica, sem bloquear permanentemente a conta nesta versão (rate limiting avançado é considerado extensão futura).
- O que acontece com um usuário cujo papel não é nem 'admin' nem 'editor'? Esse cenário não deve ocorrer pela forma como contas são criadas (fora de escopo aqui), mas caso ocorra, o acesso à área administrativa deve ser negado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir uma tela de login acessível sem autenticação prévia.
- **FR-002**: O sistema MUST autenticar usuários com papel 'admin' ou 'editor' mediante credenciais válidas (e-mail/usuário e senha).
- **FR-003**: O sistema MUST redirecionar o usuário autenticado para a área administrativa imediatamente após login bem-sucedido.
- **FR-004**: O sistema MUST exibir uma mensagem de erro genérica (sem detalhar qual campo está incorreto) quando as credenciais informadas forem inválidas.
- **FR-005**: O sistema MUST impedir o acesso de qualquer visitante não autenticado a qualquer rota dentro da área administrativa, redirecionando-o para a tela de login.
- **FR-006**: O sistema MUST permitir que um usuário autenticado encerre sua sessão (logout) a qualquer momento dentro da área administrativa.
- **FR-007**: O sistema MUST redirecionar o usuário para a tela de login imediatamente após o logout.
- **FR-008**: O sistema MUST redirecionar um usuário já autenticado para a área administrativa caso ele acesse a tela de login novamente.
- **FR-009**: O sistema MUST NOT oferecer nenhum mecanismo de autocadastro (sign-up) nesta tela — contas são criadas exclusivamente por um administrador existente, em feature separada.

### Key Entities

- **Sessão Administrativa**: Representa o estado de autenticação de um usuário do painel — vinculada a um usuário, com tempo de vida e capacidade de ser encerrada (logout).
- **Usuário Administrativo (referência)**: Entidade de papel ('admin' ou 'editor') usada para autenticação; sua criação e gestão completas pertencem à feature de administração de usuários (fora de escopo aqui) — esta spec apenas consome a verificação de credenciais e papel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário com credenciais válidas consegue acessar a área administrativa em até 1 submissão do formulário de login, sem etapas adicionais.
- **SC-002**: 100% das tentativas de acesso direto a rotas administrativas por visitantes não autenticados resultam em redirecionamento para login, sem exibir conteúdo administrativo.
- **SC-003**: 100% das tentativas de login com credenciais inválidas resultam em mensagem de erro genérica, sem indicar se o problema foi o usuário ou a senha.
- **SC-004**: Um usuário consegue encerrar sua sessão e confirmar que rotas administrativas voltam a exigir login em no máximo 1 interação (acionar logout).

## Assumptions

- Apenas dois papéis existem nesta versão: 'admin' e 'editor'; suas permissões específicas (o que cada um pode fazer dentro do painel) são definidas pelas features individuais que consomem essa autenticação, não por esta spec.
- A criação de novos usuários administrativos é uma feature separada (admin-usuarios), que esta spec assume já existir como pré-requisito de dados (usuários de seed).
- Não há recuperação de senha ("esqueci minha senha") especificada nesta versão; se necessária, será tratada como extensão futura.
- A verificação de papel (admin vs. editor) ocorre em uma camada server-side, deduplicada por requisição, não apenas na existência de sessão.
