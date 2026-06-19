# Research: Autenticação do Painel Administrativo

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

## Decisões Técnicas

### 1. Login via Server Action, não via client direto

**Decision**: O formulário de login (Client Component) invoca uma Server Action `login(input)` em `features/admin/auth/actions.ts`, que internamente chama `supabase.auth.signInWithPassword({ email, password })` usando o client `@supabase/ssr` server-side. Não há chamada direta de `signInWithPassword` a partir do browser.

**Rationale**: `@supabase/ssr` precisa escrever o cookie de sessão em uma resposta HTTP gerenciada pelo Next.js (Server Action ou Route Handler) para que o `middleware.ts` consiga lê-lo na próxima navegação. Uma chamada direta do client browser para `signInWithPassword` gerenciaria a sessão via `localStorage`, o que não é compatível com a estratégia de cookie usada por `middleware.ts` (já fixada em 001).

**Alternatives considered**:
- Route Handler dedicado (`app/api/login/route.ts`): funciona, mas introduz uma convenção a mais (API route) quando o projeto já padronizou Server Actions para toda mutação vinda de formulário — descartado por Princípio V (Simplicidade).
- `signInWithPassword` direto no Client Component: descartado pelo motivo de cookie/sessão acima.

---

### 2. Mensagem de erro genérica — mapeamento único, independente da causa

**Decision**: `login()` mapeia qualquer erro retornado por `signInWithPassword` (usuário inexistente, senha incorreta, conta desabilitada) para a mesma mensagem: `"E-mail ou senha inválidos."`. Nenhuma branch de código diferencia a causa antes de retornar ao cliente.

**Rationale**: FR-004 e SC-003 exigem explicitamente que a mensagem não revele "qual campo está incorreto" — diferenciar as causas no código (mesmo que a mensagem final fosse igual) criaria uma superfície de timing/side-channel desnecessária. Um único `catch` genérico é também a opção mais simples.

---

### 3. Redirect de usuário já autenticado em `/admin/login`

**Decision**: `app/(admin)/login/page.tsx` chama `getCurrentAdminProfile()` antes de renderizar o formulário; se retornar um perfil válido, redireciona (`redirect()` do Next.js) para a área administrativa sem renderizar nada do formulário.

**Rationale**: FR-008 exige esse redirect. Como `/admin/login` é a única rota admin fora do escopo do `middleware.ts` (que protege rotas autenticadas, não a rota de login pública), essa verificação precisa acontecer na própria página — reaproveitando `getCurrentAdminProfile()` já `cache()`-wrapped, sem nova consulta redundante.

---

### 4. Verificação de papel desconhecido (nem admin nem editor)

**Decision**: Caso `admin_profiles.role` contenha um valor fora de `'admin' | 'editor'` (cenário que não deveria ocorrer, pela CHECK constraint já definida em 001), `getCurrentAdminProfile()` trata como sessão inválida — retorna `null` em vez de propagar um papel desconhecido, forçando o redirect padrão para login.

**Rationale**: Edge Case explícito do spec.md: "o acesso à área administrativa deve ser negado" para papel desconhecido. Como o banco já impõe a constraint, isso é defesa em profundidade, não o mecanismo primário de proteção.
