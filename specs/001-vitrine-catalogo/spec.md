# Feature Specification: Vitrine Digital e Catálogo de Produtos — Nerta Brasil

**Feature Branch**: `001-vitrine-catalogo`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: Vitrine digital com catálogo de produtos para a Nerta Brasil — marca belga de química automotiva premium. O site convence, qualifica e encaminha o visitante para o Mercado Livre. Inclui painel administrativo restrito para gestão do catálogo.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Descoberta e Conversão pelo Catálogo (Priority: P1)

Um visitante chega ao site procurando um produto de limpeza automotiva. Ele navega pelo catálogo, filtra por categoria ou linha de produto, acessa a página de detalhe e clica para comprar no Mercado Livre.

**Why this priority**: É o fluxo principal de valor do produto — sem ele, o site não cumpre sua razão de existir.

**Independent Test**: Consegue-se acessar o catálogo, filtrar por categoria, abrir a página de um produto com estoque disponível e confirmar que o botão direciona para o anúncio correto no Mercado Livre em nova aba.

**Acceptance Scenarios**:

1. **Given** o visitante está no catálogo, **When** ele filtra por uma categoria, **Then** apenas produtos ativos daquela categoria são exibidos.
2. **Given** o visitante está na página de um produto com estoque > 0, **When** ele clica em "Comprar no Mercado Livre", **Then** o anúncio abre em nova aba sem redirecionar o site atual.
3. **Given** o visitante está na página de um produto com estoque = 0, **When** ele visualiza a página, **Then** o botão de compra exibe "Produto Indisponível" e está desabilitado, sem nenhum link.
4. **Given** o visitante digita a URL de um produto inativo diretamente, **When** a página carrega, **Then** ele é redirecionado para o catálogo ou vê uma página 404 adequada.

---

### User Story 2 — Apresentação da Marca na Home (Priority: P2)

Um visitante que nunca ouviu falar da Nerta chega ao site pela primeira vez. Ele vê o posicionamento da marca, os produtos em destaque e entende por que a Nerta é a escolha certa antes de ir ao catálogo.

**Why this priority**: A home é a vitrine da vitrine — define a primeira impressão e o posicionamento premium da marca.

**Independent Test**: Consegue-se acessar a home, identificar a proposta de valor da marca e ver uma seleção de produtos em destaque com link direto para seus respectivos detalhes.

**Acceptance Scenarios**:

1. **Given** o visitante acessa a home, **When** a página carrega, **Then** ele vê a proposta de valor da Nerta Brasil e pelo menos uma seção de produtos em destaque.
2. **Given** existem produtos marcados como `featured = true` e `active = true`, **When** a home carrega, **Then** esses produtos aparecem na seção de destaques.
3. **Given** o visitante clica em um produto em destaque, **When** ele é redirecionado, **Then** a página de detalhe do produto correto é exibida.

---

### User Story 3 — Gestão do Catálogo pelo Admin/Editor (Priority: P3)

Um usuário interno (admin ou editor) precisa cadastrar um novo produto, incluindo imagens, descrição técnica, especificações e o link do anúncio no Mercado Livre.

**Why this priority**: Sem gestão do catálogo, o site não tem conteúdo. É a espinha dorsal operacional do produto.

**Independent Test**: Um editor consegue criar um produto completo com imagens recortadas, definir estoque e link ML, salvar e verificar que o produto aparece no catálogo público se `active = true`.

**Acceptance Scenarios**:

1. **Given** o editor está no formulário de novo produto, **When** ele faz upload de uma imagem, **Then** o sistema exibe o cropper 1:1 para ajuste antes de salvar.
2. **Given** o editor cadastrou múltiplas imagens, **When** ele reordena por drag-and-drop, **Then** a primeira imagem passa a ser a imagem principal exibida nos cards do catálogo.
3. **Given** o editor tenta excluir um produto, **When** ele clica em excluir, **Then** um modal de confirmação com botão vermelho é exibido e a exclusão só ocorre após confirmação.
4. **Given** o editor edita um produto já existente, **When** ele salva, **Then** as alterações refletem imediatamente na vitrine pública.

---

### User Story 4 — Gestão de Categorias (Priority: P4)

Um admin ou editor precisa organizar os produtos em categorias, criando, renomeando ou excluindo categorias conforme o portfólio evolui.

**Why this priority**: As categorias estruturam a navegação do catálogo — sem elas, o filtro do visitante não funciona.

**Independent Test**: Consegue-se criar uma categoria, vinculá-la a um produto e confirmar que o filtro no catálogo público exibe a nova categoria com seus produtos.

**Acceptance Scenarios**:

1. **Given** o admin cria uma nova categoria, **When** ele salva, **Then** o slug é gerado automaticamente a partir do nome (editável antes de salvar).
2. **Given** uma categoria tem produtos vinculados, **When** o admin tenta excluí-la, **Then** o sistema bloqueia a exclusão e exibe aviso para remover ou reclassificar os produtos antes.
3. **Given** uma categoria não tem produtos, **When** o admin a exclui e confirma, **Then** a categoria é removida do sistema e desaparece dos filtros do catálogo.

---

### User Story 5 — Gestão de Usuários do Painel (Priority: P5)

Um admin precisa criar um novo usuário interno (editor), definindo nome, e-mail e papel, para que essa pessoa possa acessar o painel e gerenciar o catálogo.

**Why this priority**: Controle de acesso é pré-requisito de segurança. Editores precisam ser provisionados por admins.

**Independent Test**: Um admin consegue criar um usuário com papel "editor", e esse usuário consegue logar e acessar Produtos, Categorias e Destaques, mas não vê a seção de Usuários.

**Acceptance Scenarios**:

1. **Given** o admin está na seção de usuários, **When** ele cria um novo usuário com papel "editor", **Then** o usuário recebe acesso ao painel com as permissões corretas.
2. **Given** o admin visualiza a lista de usuários, **When** ele tenta excluir a própria conta, **Then** o botão de excluir está desabilitado para seu próprio registro.
3. **Given** um usuário com papel "editor" faz login, **When** ele acessa o painel, **Then** a seção de Usuários não aparece na navegação.
4. **Given** o admin tenta excluir qualquer usuário, **When** ele clica em excluir, **Then** um modal de confirmação com botão vermelho é exibido antes da ação.

---

### Edge Cases

- O que acontece quando um produto não tem nenhuma imagem cadastrada? (Exibir placeholder visual no card e na página de detalhe.)
- Como o sistema trata um produto com `ml_url` vazia ou inválida? (Botão "Comprar" não aparece ou aparece desabilitado mesmo com estoque > 0.)
- O que acontece ao acessar `/admin` sem estar autenticado? (Redirect imediato para a página de login do painel.)
- O que acontece se o visitante tenta acessar diretamente a URL de um produto inativo? (Retorna 404 ou redirect para o catálogo.)
- O que acontece quando não há produtos em destaque cadastrados? (A seção de destaques na home não exibe conteúdo vazio — é omitida ou exibe mensagem neutra.)

---

## Requirements *(mandatory)*

### Functional Requirements

**Vitrine pública:**

- **FR-001**: O catálogo DEVE listar todos os produtos com `active = true`, exibindo imagem principal, nome, linha e categoria.
- **FR-002**: O visitante DEVE poder filtrar o catálogo por categoria e por linha de produto.
- **FR-003**: Cada produto DEVE ter uma página de detalhe com URL única (baseada no slug), contendo nome, todas as imagens, descrição completa, especificações técnicas (diluição, atributos) e o botão de compra.
- **FR-004**: Quando `stock > 0` e `ml_url` preenchida, a página de produto DEVE exibir o botão "Comprar no Mercado Livre" que abre o link em nova aba.
- **FR-005**: Quando `stock = 0`, a página de produto DEVE exibir "Produto Indisponível" no lugar do botão de compra, sem nenhum link.
- **FR-006**: Cada página de produto DEVE ter título, descrição e URL otimizados para indexação em buscadores.
- **FR-007**: A home DEVE exibir uma seção com os produtos marcados como `featured = true` e `active = true`.
- **FR-008**: Produtos com `active = false` NÃO DEVEM aparecer em nenhuma listagem pública.

**Painel administrativo:**

- **FR-009**: O acesso ao painel (`/admin/*`) DEVE ser restrito a usuários autenticados; visitantes não autenticados são redirecionados para o login.
- **FR-010**: Admin e editor DEVEM poder criar, editar e excluir produtos.
- **FR-011**: O formulário de produto DEVE permitir upload de múltiplas imagens com recorte 1:1 obrigatório antes de salvar cada imagem.
- **FR-012**: O admin/editor DEVE poder reordenar as imagens do produto por drag-and-drop; a primeira imagem na ordem é a imagem principal.
- **FR-013**: O admin/editor DEVE poder definir `active`, `featured`, `stock` e `ml_url` de cada produto.
- **FR-014**: O slug do produto DEVE ser gerado automaticamente a partir do nome, com opção de edição manual antes de salvar.
- **FR-015**: Admin e editor DEVEM poder criar, editar e excluir categorias.
- **FR-016**: O slug da categoria DEVE ser gerado automaticamente a partir do nome, com opção de edição manual.
- **FR-017**: Excluir uma categoria que possui produtos vinculados DEVE ser bloqueado, com mensagem orientando o usuário a reclassificar os produtos antes.
- **FR-018**: Toda ação de exclusão (produto, categoria, usuário) DEVE exigir confirmação em modal com botão de confirmação em destaque vermelho.
- **FR-019**: Admin DEVE poder criar e excluir usuários do painel, definindo nome, e-mail e papel (admin ou editor).
- **FR-020**: Admin NÃO DEVE poder excluir a própria conta.
- **FR-021**: Usuários com papel "editor" NÃO DEVEM ver nem acessar a seção de Usuários do painel.
- **FR-022**: Nenhum usuário pode se auto-registrar; apenas admins criam novos usuários.

### Key Entities

- **Produto**: Unidade central do catálogo. Possui nome, slug único, linha, categoria, diluição, atributos (lista), descrição curta, descrição longa, galeria de imagens ordenada, estoque, flags `active` e `featured`, e link para o Mercado Livre.
- **Categoria**: Agrupamento de produtos. Possui nome e slug único. Uma categoria pode ter zero ou mais produtos.
- **Imagem de Produto**: Vinculada a um produto, com posição que determina a ordem de exibição. A posição 1 é a imagem principal (capa no card do catálogo).
- **Usuário Admin**: Usuário interno do painel. Possui nome, e-mail e papel (`admin` ou `editor`). Nunca é visível ao público.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante consegue encontrar e acessar a página de um produto específico em no máximo 3 cliques a partir da home.
- **SC-002**: Cada página de produto possui URL única, título e descrição descritivos que permitem indexação individual por buscadores.
- **SC-003**: 100% dos cliques em "Comprar no Mercado Livre" abrem o anúncio em nova aba sem perder o visitante do site.
- **SC-004**: Produtos com estoque zero nunca exibem botão de compra funcional — a indisponibilidade é visualmente clara em 100% dos casos.
- **SC-005**: Um admin ou editor consegue cadastrar um produto completo (nome, imagens, descrição, link ML) em menos de 10 minutos.
- **SC-006**: O painel administrativo é inacessível a qualquer visitante não autenticado — 100% das tentativas de acesso direto resultam em redirect para login.
- **SC-007**: Nenhuma exclusão de produto, categoria ou usuário ocorre sem confirmação explícita do usuário — risco de exclusão acidental é eliminado.
- **SC-008**: A vitrine exibe apenas produtos ativos — produtos inativos não aparecem em nenhuma listagem ou busca pública.

---

## Assumptions

- O site é inteiramente em português (pt-BR).
- A busca por texto livre no catálogo está fora do escopo do MVP; filtro por categoria e linha é suficiente.
- O cliente final nunca faz login, cria conta ou interage com qualquer formulário no site público.
- Não existe integração com estoque em tempo real; o controle de `stock` é manual pelo admin/editor.
- A senha de usuários do painel é gerenciada via fluxo de redefinição por e-mail; o admin não define nem vê senhas.
- Produtos podem pertencer a apenas uma categoria por vez.
- O link do Mercado Livre (`ml_url`) é inserido manualmente pelo admin/editor — não há integração com a API do ML.
- A home terá seção de destaques apenas se existirem produtos com `featured = true` e `active = true`; caso contrário, a seção é omitida.
