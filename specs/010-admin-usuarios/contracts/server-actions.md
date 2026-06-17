# Server Actions — Admin Usuários

**Date**: 2026-06-16
**Feature**: [spec.md](../spec.md)

Revisão de `001-vitrine-catalogo/contracts/server-actions.md#server-actions--admin-usuários` para esta feature. Único arquivo: `features/admin/users/actions.ts`. Todas exigem `getCurrentAdminProfile()?.role === 'admin'` (não `editor`) — checagem feita dentro de cada action, não apenas na UI.

---

## `createUser(input)`

```ts
createUser(input: CreateUserInput): Promise<ActionResult<AdminProfile>>
```

```ts
type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: AdminRole; // 'admin' | 'editor'
};
```

**Fluxo**:
1. Verifica `role === 'admin'` do usuário atual — senão retorna `{ success: false, error: "..." }`.
2. Valida `input` via `createUserSchema` (Zod) — e-mail bem formado, senha com tamanho mínimo, papel dentre os valores válidos.
3. Chama `supabase.auth.admin.createUser({ email, password, email_confirm: true })` usando o client `service_role`.
4. Se o passo 3 retornar erro de e-mail duplicado, mapeia para mensagem de duplicidade (FR-003). Qualquer outro erro da Admin API é retornado como mensagem genérica.
5. Insere `{ id: <id retornado>, name, role }` em `admin_profiles`. Se esta inserção falhar, desfaz o passo 3 com `auth.admin.deleteUser(id)` antes de retornar erro.
6. Retorna `{ success: true, data: <AdminProfile completo, incluindo email> }`.

---

## `deleteUser(id)`

```ts
deleteUser(id: string): Promise<ActionResult>
```

**Fluxo**:
1. Verifica `role === 'admin'` do usuário atual.
2. **Bloqueado** se `id === (await getCurrentAdminProfile())!.id` — retorna `{ success: false, error: "Você não pode excluir a própria conta." }` sem chamar a Admin API (FR-007).
3. Chama `supabase.auth.admin.deleteUser(id)`. `admin_profiles` é removido via cascade.
4. Retorna `{ success: true, data: undefined }`.

---

## `getAdminUsers()`

```ts
getAdminUsers(): Promise<ActionResult<AdminProfile[]>>
```

**Fluxo**:
1. Verifica `role === 'admin'` do usuário atual — diferente de 001, esta versão retorna `ActionResult` (não a lista direto) para que a UI distinga "sem permissão" de "lista vazia".
2. Lê `admin_profiles` com o e-mail correspondente de `auth.users` (via Admin API ou view com `security_invoker`), ordenado por `name ASC`.
3. Retorna `{ success: true, data: AdminProfile[] }`.

---

## Tipos consumidos (revisão de `001/contracts/types.ts`)

```ts
export type AdminRole = "admin" | "editor";

export type AdminProfile = {
  id: string;
  name: string;
  role: AdminRole;
  email: string; // resolvido a partir de auth.users
  created_at: string;
};

// Revisão: ganha `password`, ausente na versão original de 001
export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
};
```
