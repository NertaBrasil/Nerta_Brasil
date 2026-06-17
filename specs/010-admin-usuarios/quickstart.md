# Quickstart — Validação Manual: Gestão de Usuários Administrativos

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

Complementar à suite automatizada (Princípio VI da constituição) — não a substitui. Pressupõe o ambiente já validado por `001-vitrine-catalogo/quickstart.md` (`make dev` rodando, seed aplicado com ao menos um usuário `admin`).

## 1. Criar um novo usuário

- Logar como `admin` de seed e acessar `/admin/usuarios`.
- Preencher nome, e-mail, senha e papel `editor`. Submeter.
- **Esperado**: usuário aparece na listagem imediatamente, com papel "editor" visível (FR-009).
- Deslogar e logar com o e-mail/senha recém-criados.
- **Esperado**: login funciona imediatamente, sem etapa adicional de definição de senha (SC-003).

## 2. Bloquear e-mail duplicado

- Repetir a criação acima com o mesmo e-mail já usado.
- **Esperado**: erro de duplicidade exibido, nenhum novo registro criado (FR-003).

## 3. Tentar acessar a tela como `editor`

- Logar como o usuário `editor` criado no passo 1.
- Tentar acessar `/admin/usuarios` diretamente pela URL.
- **Esperado**: acesso negado/redirecionado — menu lateral nem exibe o link (FR-001).

## 4. Bloqueio de autoexclusão

- Logado como `admin`, localizar a própria linha na listagem.
- **Esperado**: ação de excluir indisponível ou bloqueada nessa linha específica (FR-007).
- (Verificação de backend) Tentar invocar `deleteUser` diretamente com o próprio `id` da sessão atual.
- **Esperado**: operação rejeitada, mesmo contornando a UI.

## 5. Excluir outro usuário

- Logado como `admin`, excluir o usuário `editor` criado no passo 1, confirmando no modal com scrim escuro.
- **Esperado**: usuário removido da listagem; login com aquelas credenciais passa a falhar imediatamente (FR-005, FR-006, SC-004).
