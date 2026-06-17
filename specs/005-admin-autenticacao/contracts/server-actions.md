# Server Actions — Admin Autenticação

**Date**: 2026-06-16
**Feature**: [spec.md](../spec.md)

Único contrato novo desta feature. `getCurrentAdminProfile()` e `logout()` já estão definidos em [001-vitrine-catalogo/contracts/server-actions.md](../../001-vitrine-catalogo/contracts/server-actions.md#sessão-admin-featuresadminauthsessionts) e [#server-actions--shell](../../001-vitrine-catalogo/contracts/server-actions.md#server-actions--shell-featuresshellactionsts) — não revisados aqui.

---

## `login(input)`

```ts
login(input: LoginInput): Promise<ActionResult<void>>
```

```ts
type LoginInput = {
  email: string;
  password: string;
};
```

**Fluxo**:
1. Valida `input` via `loginSchema` (Zod) — e-mail bem formado, senha não vazia. Erro de validação retorna a mesma mensagem genérica (ver `research.md` §2), sem detalhar o campo.
2. Chama `supabase.auth.signInWithPassword({ email, password })` usando o client server-side (`@supabase/ssr`), que persiste a sessão via cookie.
3. Qualquer erro do passo 2 é mapeado para `{ success: false, error: "E-mail ou senha inválidos." }`.
4. Em sucesso, retorna `{ success: true, data: undefined }`; o Client Component do formulário é responsável por redirecionar para a área administrativa após receber `success: true`.

**Não verifica papel** — a verificação de `role IN ('admin', 'editor')` acontece em `getCurrentAdminProfile()`, chamado pelo `(admin)/layout.tsx` na navegação subsequente, não dentro de `login()`.
