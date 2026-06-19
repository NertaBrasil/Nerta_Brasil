# Research: Gestão de Usuários Administrativos no Painel

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

## Decisões Técnicas

### 1. Senha definida diretamente pelo admin (não por e-mail de redefinição)

**Decision**: `createUser` chama a Admin API do Supabase (`supabase.auth.admin.createUser({ email, password, email_confirm: true, ... })`) com a senha informada no formulário, em vez do fluxo de "e-mail de definição de senha" esboçado em `001-vitrine-catalogo/contracts/server-actions.md`.

**Rationale**: `spec.md` FR-002 exige que o admin informe "e-mail, senha inicial e papel" na criação, e SC-003 exige que a conta seja criada "em uma única submissão de formulário". Um fluxo de e-mail de redefinição exigiria uma segunda etapa fora do controle desta tela (o novo usuário precisa abrir o e-mail e definir a senha antes de conseguir logar), o que violaria SC-003. `email_confirm: true` evita a etapa de confirmação de e-mail, já que a conta nasce de uma ação administrativa interna, não de autocadastro.

**Alternatives considered**:
- E-mail de definição de senha (esboço original de 001): descartado — não atende SC-003 e exige configuração de templates de e-mail transacional, fora do escopo desta feature.
- Senha temporária gerada pelo sistema, exibida uma única vez ao admin: descartado por simplicidade (Princípio V) — o spec já define que o admin informa a senha, não que o sistema a gera.

**Impacto em 001**: `CreateUserInput` (em `001/contracts/types.ts`) ganha o campo `password: string`, ausente na versão original. `admin_profiles` continua sem armazenar senha (gerenciada inteiramente por `auth.users`).

---

### 2. Campo `name` mantido no formulário de criação

**Decision**: O formulário de criação inclui `name` (nome de exibição), além de e-mail, senha e papel.

**Rationale**: A coluna `admin_profiles.name` é `NOT NULL` (definida em `001-vitrine-catalogo/data-model.md`) e é o que torna a listagem (FR-009) legível — exibir apenas e-mails na tabela de usuários seria utilizável, mas o modelo de dados já reservado em 001 prevê um nome de exibição para o Sidebar e para esta listagem. `spec.md` não proíbe esse campo; trata-se de um detalhe de formulário coerente com o modelo de dados já aprovado, não uma mudança de escopo de negócio.

**Alternatives considered**:
- Derivar `name` automaticamente da parte local do e-mail (ex: `joao` de `joao@nerta.com.br`): descartado — produz nomes de exibição de baixa qualidade sem ganho de simplicidade real, já que o formulário já coleta outros três campos.

---

### 3. Exclusão via Admin API com cascade nativo

**Decision**: `deleteUser(id)` chama `supabase.auth.admin.deleteUser(id)`. A FK `admin_profiles.id → auth.users(id) ON DELETE CASCADE` (já definida em 001) remove a linha de `admin_profiles` automaticamente — nenhuma query adicional de DELETE é necessária.

**Rationale**: Evita duas operações que precisariam ser transacionais (deletar de `auth.users` e de `admin_profiles` separadamente); o cascade do Postgres já garante atomicidade.

**Alternatives considered**: Deletar primeiro de `admin_profiles` e depois de `auth.users` via duas chamadas — descartado, redundante diante do cascade já modelado.

---

### 4. Guard de autoexclusão — comparação direta de IDs, em duas camadas

**Decision**: Tanto a UI (`UserList`/`DeleteUserModal`) quanto a Server Action `deleteUser(id)` comparam `id` com `(await getCurrentAdminProfile())!.id`. Na UI, a linha do próprio admin logado não exibe a ação de excluir. Na action, a comparação é a primeira verificação, antes de qualquer chamada à Admin API — retorna `ActionResult` de erro sem efeito colateral.

**Rationale**: FR-007 exige bloqueio "tanto na interface quanto no backend", e o Edge Case da spec exige que a rejeição funcione "independentemente da origem da requisição" — ou seja, mesmo que a Server Action seja invocada diretamente (bypassando a UI). `getCurrentAdminProfile()` (já definido em 001, `cache()`-wrapped) é reaproveitado sem alteração.

---

### 5. Duplicidade de e-mail — delegada à constraint nativa do Supabase Auth

**Decision**: Não há verificação manual de duplicidade antes do INSERT. `auth.admin.createUser` retorna um erro nativo quando o e-mail já existe em `auth.users`; `createUser` (Server Action) mapeia esse erro para a mensagem de duplicidade exigida por FR-003.

**Rationale**: `auth.users.email` já é único por constraint do próprio Supabase Auth — duplicar essa verificação na aplicação introduziria uma janela de corrida (TOCTOU) sem necessidade, além de violar o Princípio V (Simplicidade).

**Alternatives considered**: Query de verificação prévia (`SELECT ... WHERE email = ?`) antes do INSERT — descartado por ser redundante e propenso a condição de corrida.

---

### 6. Restrição a `role = 'admin'` (mais estrita que as demais telas admin)

**Decision**: `createUser`, `deleteUser` e `getAdminUsers` exigem `getCurrentAdminProfile()?.role === 'admin'` — diferente das demais Server Actions de 001 (produtos, categorias, destaques), que aceitam `role IN ('admin', 'editor')`.

**Rationale**: FR-001 e FR-008 da spec são explícitos: apenas `admin` acessa esta tela e suas ações; `editor` é rejeitado tanto na UI (rota) quanto no backend. É a única tela do painel com essa restrição adicional.
