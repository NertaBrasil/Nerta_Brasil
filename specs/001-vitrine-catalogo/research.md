# Research: Vitrine Digital e Catálogo — Nerta Brasil

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

## Decisões Técnicas

### 1. Renderização: Server Components por padrão

**Decision**: Next.js App Router com RSC como padrão. `"use client"` apenas onde há interação de browser (filtros, analytics, cropper, drag-and-drop, formulários).

**Rationale**: SEO é o objetivo primário do produto. Páginas de produto renderizadas no servidor são indexadas diretamente pelo Google sem depender de JavaScript do browser. RSC também reduz o bundle JS enviado ao visitante.

**Alternatives considered**:
- SPA pura (Next.js Pages Router + `getServerSideProps`): descartada — overhead de hidratação, sem RSC, API menos ergonômica.
- Static generation total (SSG): inadequado para catálogo gerenciado pelo admin que muda com frequência sem rebuild.

---

### 2. Autenticação: Supabase Auth com `@supabase/ssr`

**Decision**: Supabase Auth para o painel admin. Middleware do Next.js intercepta todas as rotas `/admin/*` e valida a sessão via cookie.

**Rationale**: Integração nativa com o banco Supabase, sem infraestrutura extra. `@supabase/ssr` é a biblioteca oficial para Next.js App Router — gerencia cookies de sessão corretamente em Server e Client Components.

**Alternatives considered**:
- NextAuth.js: mais complexo, requer adapter de banco, overhead para um caso de uso simples.
- Autenticação customizada com JWT manual: risco de segurança desnecessário.

**Security note**: O papel do usuário (admin/editor) é armazenado na tabela `admin_profiles` — nunca em `user_metadata` (editável pelo usuário). Políticas RLS referenciam `auth.uid()` + join com `admin_profiles`.

---

### 3. Imagens: Supabase Storage + crop 1:1 no browser

**Decision**: Upload direto para Supabase Storage a partir do browser (Client Component). Crop via biblioteca de cropper antes do upload. Armazenar `storage_path` e `position` na tabela `product_images`.

**Rationale**: Supabase Storage é gerenciado, sem custo de infra adicional. Crop no browser evita processamento de imagem no servidor. URL pública do Storage serve a imagem direto ao visitante, sem passar pelo Next.js.

**Alternatives considered**:
- Cloudinary: custo adicional e dependência externa desnecessária.
- Crop server-side (sharp): complexidade maior, bloqueante durante upload.

---

### 4. Analytics: GA4 + Meta Pixel via helper client-side

**Decision**: `infrastructure/analytics.ts` exporta `trackBuyClick(slug)` que chama `gtag('event', ...)` e `fbq('track', ...)`. Chamado exclusivamente no `onClick` do botão "Comprar no Mercado Livre" (Client Component).

**Rationale**: GA4 e Pixel são browser-only. Encapsular em um helper evita importações de browser em RSC e centraliza a lógica de rastreamento.

**Alternatives considered**:
- Vercel Analytics: não substitui GA4 para remarketing Meta.
- Server-side events (Conversions API): complexidade além do MVP; pode ser adicionado depois.

---

### 5. Banco local: Docker Compose + Supabase CLI para migrations

**Decision**: PostgreSQL local via Docker Compose. Migrations gerenciadas pelo Supabase CLI (`supabase migration new`, `supabase db push`). Makefile como ponto de entrada.

**Rationale**: Mantém paridade entre ambiente local e produção (Supabase usa PostgreSQL). Supabase CLI gera e aplica migrations de forma idempotente.

**Alternatives considered**:
- Prisma migrations: outra camada de abstração desnecessária; o projeto já usa Supabase CLI.
- SQL manual sem versionamento: impossível de reproduzir e auditar.

---

### 6. Deploy: Vercel + Supabase

**Decision**: Aplicação na Vercel (integração nativa com Next.js, deploy automático da branch `main`). Banco em produção via Supabase (gerenciado). Storage de imagens via Supabase Storage.

**Rationale**: Zero configuração de infra. Vercel cuida de CDN, edge, e SSL. Supabase cuida de backups e escalabilidade do banco.

**Alternatives considered**:
- Railway ou Render: mais configuração manual, sem integração nativa com Next.js.
- Self-hosted PostgreSQL: overhead operacional desnecessário no MVP.
