# Feature Specification: Formulário de Parceria + Modo de Compra por Produto

**Feature Branch**: `011-formulario-parceria`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "Formulário de Qualificação de Parceiros + modo de compra configurável por produto. Hoje o botão "Comprar no Mercado Livre" (spec 003) sempre abre o link do Mercado Livre em nova aba. Esta feature introduz uma escolha por produto, definida no cadastro/edição do produto no admin: "abrir link do Mercado Livre" (comportamento atual) ou "abrir formulário de parceria" (novo). Quando o modo é formulário, o botão na página do produto abre o "Programa de Qualificação de Parceiros Nerta Brasil" — um formulário público em múltiplas etapas (...). Na etapa "Dados da Empresa", o usuário escolhe entre Pessoa Jurídica (CNPJ) ou Pessoa Física (CPF) através de um toggle (...). Ao enviar o formulário, a submissão é registrada vinculada ao produto que originou o clique e fica disponível para consulta na área administrativa. Não há edição nem exclusão das respostas nesta versão. O envio do formulário não dispara eventos de analytics de e-commerce. Esta é uma spec derivada/complementar à 003-pagina-produto."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin define o modo de compra do produto (Priority: P1)

Um administrador cadastra ou edita um produto e escolhe se o botão de compra desse produto deve abrir o link do Mercado Livre (comportamento atual) ou abrir o Formulário de Parceria (novo). Essa escolha é feita por produto, não é global para o catálogo.

**Why this priority**: Sem essa configuração não existe como direcionar produtos específicos para o fluxo de parceria — é o que liga as duas pontas da feature (admin e vitrine pública).

**Independent Test**: Pode ser testado cadastrando dois produtos com modos diferentes e confirmando que cada um é salvo e recuperado com o modo correto, mesmo sem o formulário público existir ainda.

**Acceptance Scenarios**:

1. **Given** um admin está cadastrando um novo produto, **When** ele seleciona o modo de compra "Formulário de Parceria" e salva, **Then** o produto é persistido com esse modo e o link de Mercado Livre deixa de ser obrigatório para esse produto.
2. **Given** um produto existente está configurado com modo "Link Mercado Livre", **When** o admin edita o produto e altera o modo para "Formulário de Parceria" (ou vice-versa), **Then** a alteração é salva e passa a valer para os próximos acessos à página do produto.

---

### User Story 2 - Visitante preenche e envia o Formulário de Parceria (Priority: P1)

Um visitante acessa a página de um produto configurado com modo "Formulário de Parceria" e clica no botão de compra. Em vez de ser redirecionado ao Mercado Livre, ele vê o Formulário de Parceria, composto por múltiplas etapas (dados da empresa ou do profissional, perfil de relacionamento desejado com a marca, perfil de mercado, desafios e prioridades como fornecedor, potencial de crescimento conjunto, planejamento de compra futura e interesse no programa Pioneer Partners). Na etapa de identificação, o visitante escolhe se está se candidatando como Pessoa Jurídica (informando CNPJ) ou Pessoa Física (informando CPF), e os campos da etapa se ajustam a essa escolha. Ao concluir todas as etapas, o visitante envia o formulário.

**Why this priority**: É a entrega de valor central da feature — sem o formulário funcional, a configuração do admin (User Story 1) não tem efeito visível para o visitante.

**Independent Test**: Pode ser testado isoladamente acessando a página de um produto em modo formulário, preenchendo e enviando os dados (em ambos os caminhos, Pessoa Jurídica e Pessoa Física), e confirmando que o envio é concluído com sucesso.

**Acceptance Scenarios**:

1. **Given** um produto está configurado com modo "Formulário de Parceria", **When** o visitante clica no botão de compra, **Then** o Formulário de Parceria é exibido em vez de qualquer link externo.
2. **Given** o visitante está na etapa de identificação do formulário, **When** ele escolhe "Pessoa Física", **Then** os campos "Razão Social" e "Nome Fantasia" são substituídos por "Nome Completo" e o campo de documento passa a validar como CPF.
3. **Given** o visitante está na etapa de identificação do formulário, **When** ele escolhe "Pessoa Jurídica", **Then** os campos "Razão Social" e "Nome Fantasia" permanecem disponíveis e o campo de documento valida como CNPJ.
4. **Given** o visitante preencheu todas as etapas obrigatórias corretamente, **When** ele envia o formulário, **Then** a submissão é registrada vinculada ao produto que originou o clique e o visitante recebe confirmação de envio.
5. **Given** o visitante informa um CNPJ ou CPF em formato inválido, **When** ele tenta avançar ou enviar, **Then** o sistema recusa o envio e indica o campo a ser corrigido.

---

### User Story 3 - Admin consulta as respostas recebidas (Priority: P2)

Um administrador (papel admin ou editor) acessa uma nova seção da área administrativa dedicada às submissões do Formulário de Parceria, vê a lista de candidaturas recebidas e abre o detalhe de uma submissão para ver todas as respostas preenchidas pelo visitante, incluindo qual produto originou aquela candidatura.

**Why this priority**: Sem essa visualização, as submissões coletadas pela User Story 2 não geram valor de negócio — ninguém consegue agir sobre os leads recebidos. É P2 porque depende logicamente de já existirem submissões (US2) para ter algo a exibir, mas não bloqueia o lançamento do formulário em si.

**Independent Test**: Pode ser testado entrando como admin ou editor autenticado, abrindo a nova seção e confirmando que submissões previamente registradas (via dados de teste) aparecem listadas e podem ser abertas individualmente.

**Acceptance Scenarios**:

1. **Given** existem submissões registradas, **When** um admin ou editor autenticado acessa a seção de respostas do Formulário de Parceria, **Then** ele vê a lista de submissões recebidas, mais recentes primeiro.
2. **Given** o admin está na lista de submissões, **When** ele abre uma submissão específica, **Then** vê todos os campos preenchidos pelo visitante e o produto que originou aquela candidatura.
3. **Given** um usuário não autenticado (ou autenticado sem papel admin/editor), **When** ele tenta acessar a seção de respostas, **Then** o acesso é negado, seguindo o mesmo mecanismo de proteção já usado nas demais áreas administrativas.

---

### Edge Cases

- O que acontece se o visitante recarregar ou fechar a página no meio do preenchimento do formulário? O progresso preenchido até então é perdido — não há rascunho/retomada nesta versão.
- O que acontece se um produto que já recebeu submissões tiver seu modo de compra alterado posteriormente (de formulário para link, ou o produto for desativado/excluído)? As submissões já registradas permanecem intactas e continuam associadas ao produto original, mesmo que o comportamento atual do botão de compra tenha mudado.
- O que acontece se o visitante tentar enviar o formulário com um CNPJ ou CPF em formato inválido? O envio é bloqueado até a correção do campo.
- O que acontece com um produto sem modo de compra definido? Não existe esse estado — todo produto sempre tem um modo de compra explícito, com "Link Mercado Livre" como valor padrão (preserva o comportamento de produtos já cadastrados antes desta feature).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que um admin defina, ao cadastrar ou editar um produto, qual modo de compra esse produto utiliza: "Link Mercado Livre" ou "Formulário de Parceria".
- **FR-002**: Produtos existentes, cadastrados antes desta feature, MUST manter o comportamento atual ("Link Mercado Livre") como modo padrão, sem exigir ação manual do admin.
- **FR-003**: Quando o modo de compra de um produto for "Link Mercado Livre", o botão de compra na página do produto MUST preservar o comportamento já definido pela spec 003-pagina-produto (abrir o link em nova aba, ou exibir "Produto Indisponível" quando aplicável).
- **FR-004**: Quando o modo de compra de um produto for "Formulário de Parceria", o botão de compra na página do produto MUST abrir o Formulário de Parceria em vez de qualquer link externo, independentemente do estoque do produto.
- **FR-005**: O Formulário de Parceria MUST ser organizado em múltiplas etapas, cobrindo: identificação do candidato; perfil de relacionamento desejado com a marca; perfil do mercado em que atua; desafios e prioridades como comprador de produtos de limpeza profissional; potencial de crescimento conjunto e estrutura (comercial/logística); planejamento de compra futura; e interesse no programa NERTA Pioneer Partners.
- **FR-006**: Na etapa de identificação, o sistema MUST oferecer ao visitante a escolha entre "Pessoa Jurídica" e "Pessoa Física" antes de exibir os campos de documento.
- **FR-007**: Ao escolher "Pessoa Física", o sistema MUST substituir os campos "Razão Social" e "Nome Fantasia" por um único campo "Nome Completo", e MUST validar o campo de documento como CPF.
- **FR-008**: Ao escolher "Pessoa Jurídica", o sistema MUST manter os campos "Razão Social" e "Nome Fantasia", e MUST validar o campo de documento como CNPJ.
- **FR-009**: O sistema MUST impedir o envio do formulário caso o documento informado (CNPJ ou CPF, conforme o tipo escolhido) não esteja em formato válido.
- **FR-010**: O sistema MUST registrar cada submissão do Formulário de Parceria vinculada ao produto cujo botão de compra originou aquele preenchimento.
- **FR-011**: O sistema MUST NOT disparar eventos de analytics de e-commerce (equivalentes a "compra" ou "adicionar ao carrinho") quando o Formulário de Parceria for enviado — esse fluxo é geração de lead B2B, não uma transação de venda.
- **FR-012**: O sistema MUST restringir a visualização das submissões recebidas a administradores autenticados com papel "admin" ou "editor", reaproveitando o mecanismo de autenticação já existente (spec 005-admin-autenticacao).
- **FR-013**: O sistema MUST exibir, na área administrativa, a lista de submissões recebidas ordenada das mais recentes para as mais antigas, e permitir abrir o detalhe completo de cada submissão.
- **FR-014**: O detalhe de uma submissão MUST exibir todos os campos preenchidos pelo candidato e o produto que originou aquela candidatura.
- **FR-015**: O sistema MUST NOT oferecer, nesta versão, nenhuma forma de editar ou excluir submissões já recebidas pela área administrativa.

### Key Entities

- **Modo de Compra do Produto**: atributo do produto existente (entidade já coberta pela spec 001/003) que determina o comportamento do botão de compra na página pública: "Link Mercado Livre" (padrão, comportamento já existente) ou "Formulário de Parceria" (novo). Não há terceiro estado.
- **Submissão de Formulário de Parceria**: representa a candidatura de um visitante interessado em se tornar parceiro Nerta Brasil. Contém o tipo de candidato (Pessoa Jurídica ou Pessoa Física) e o respectivo documento (CNPJ ou CPF, mutuamente exclusivos), os dados de identificação e contato, e as respostas às demais etapas do formulário (perfil de relacionamento, perfil de mercado, desafios e prioridades, potencial de crescimento, planejamento futuro e interesse no programa Pioneer Partners). Está sempre vinculada ao produto que originou o clique no botão de compra, e é somente leitura após o envio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um admin consegue alternar o modo de compra de qualquer produto entre "Link Mercado Livre" e "Formulário de Parceria" sem depender de suporte técnico ou alteração direta no banco de dados.
- **SC-002**: 100% das submissões enviadas com sucesso pelo Formulário de Parceria aparecem na área administrativa com o produto de origem corretamente identificado.
- **SC-003**: Um visitante que se identifica como Pessoa Física consegue concluir e enviar o formulário completo sem que o sistema exija a informação de CNPJ em nenhum momento.
- **SC-004**: Um visitante que se identifica como Pessoa Jurídica consegue concluir e enviar o formulário completo sem que o sistema exija a informação de CPF em nenhum momento.
- **SC-005**: Nenhuma submissão registrada no sistema fica sem produto de origem associado.

## Assumptions

- Todos os campos do Formulário de Parceria são obrigatórios, exceto o campo "LinkedIn" na etapa de identificação e os campos de texto livre que pedem detalhamento opcional (ex.: "o que despertou seu interesse"), que ficam como preenchimento opcional — refletindo o único campo explicitamente marcado como "(opcional)" no material de referência usado para esta spec.
- O formulário não salva rascunho/progresso parcial entre sessões nesta versão; o preenchimento é feito em uma única visita.
- Como o Formulário de Parceria é uma jornada de geração de lead B2B (e não uma compra), os requisitos de analytics de e-commerce (GA4 purchase, Meta Pixel de conversão de venda) definidos na spec 003-pagina-produto não se aplicam a esse caminho; instrumentação de analytics específica para leads, se desejada, está fora do escopo desta versão.
- O conjunto exato de campos e tipos de resposta (texto livre, escolha única, múltipla escolha) de cada etapa do formulário segue o material de referência visual compartilhado para esta feature, e será detalhado no modelo de dados durante o planejamento técnico.
- A autenticação e a verificação de papel (admin/editor) reaproveitam integralmente o mecanismo já implementado na spec 005-admin-autenticacao — esta spec não redefine login, logout ou proteção de rotas.
