# Data Model: Gestão de Usuários Administrativos no Painel

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

A tabela usada por esta feature já está definida em [001-vitrine-catalogo/data-model.md](../001-vitrine-catalogo/data-model.md#admin_profiles). Este documento detalha apenas como esta feature a consome, sem alterar o schema.

## `admin_profiles` (consumo desta feature)

| Coluna | Tipo | Origem nesta feature |
|--------|------|------------------------|
| `id` | `uuid` | Igual ao `id` retornado por `auth.admin.createUser()` (Admin API) |
| `name` | `text` | Informado no formulário de criação (`UserForm`) — ver [research.md](./research.md#2-campo-name-mantido-no-formulário-de-criação) |
| `role` | `text` | Informado no formulário de criação; `'admin'` ou `'editor'` |
| `created_at` | `timestamptz` | `DEFAULT now()`, não editável |

**E-mail e senha**: não residem em `admin_profiles`. `email` vem de `auth.users` (join implícito feito pela query de `getAdminUsers`); `password` é enviado apenas no momento da criação à Admin API do Supabase Auth e nunca persistido em texto nem em qualquer coluna desta tabela.

## Regras aplicadas por esta feature

- **Criação**: `createUser` insere simultaneamente em `auth.users` (via Admin API, `service_role`) e em `admin_profiles` (mesma transação lógica — se a inserção em `admin_profiles` falhar após o `auth.users` ter sido criado, a action deve desfazer criando rollback manual via `auth.admin.deleteUser`, já que não há transação cross-schema nativa entre Auth e tabelas de aplicação).
- **Exclusão**: `deleteUser` chama apenas `auth.admin.deleteUser(id)`; a linha em `admin_profiles` é removida automaticamente pelo `ON DELETE CASCADE` já definido em 001.
- **Guard de autoexclusão**: aplicado em código (Server Action), não em constraint de banco — comparação de `id` contra a sessão atual antes de qualquer chamada à Admin API.
- **Unicidade de e-mail**: garantida pela constraint nativa de `auth.users.email`, não duplicada em `admin_profiles`.

## Relacionamentos

Sem alteração em relação a 001:

```text
auth.users
  └── admin_profiles (id FK, CASCADE on delete)
```

## RLS

Sem alteração em relação à tabela já definida em 001 — `admin_profiles` permanece sem acesso via `anon`, e SELECT/INSERT/UPDATE/DELETE via `authenticated` é mediado exclusivamente pelas Server Actions desta feature (nunca exposto diretamente via Data API ao client).
