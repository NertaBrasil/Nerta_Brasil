# Data Model: Vitrine Digital e Catálogo — Nerta Brasil

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

## Entidades

### `categories`

Agrupamento de produtos. Um produto pertence a uma categoria.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Identificador único |
| `name` | `text` | NOT NULL | Nome exibido na vitrine e no admin |
| `slug` | `text` | NOT NULL, UNIQUE | Gerado a partir do nome; usado em filtros de URL |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Data de criação |

**Regras**:
- `slug` gerado via `slugify(name)` antes de inserir; editável pelo admin antes de salvar.
- Excluir categoria com produtos vinculados é BLOQUEADO (verificar FK antes de DELETE).

---

### `products`

Unidade central do catálogo.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Identificador único |
| `slug` | `text` | NOT NULL, UNIQUE | URL da página de produto (`/produtos/[slug]`) |
| `name` | `text` | NOT NULL | Nome do produto |
| `line` | `text` | NOT NULL | Linha comercial (ex: "Linha Frotas", "Linha Agro") |
| `category_id` | `uuid` | FK → `categories.id`, SET NULL on delete | Categoria do produto |
| `dilution` | `text` | | Diluição recomendada (ex: "3–5%") |
| `attributes` | `text[]` | DEFAULT `'{}'` | Atributos técnicos (ex: `{"Touchless","Agro"}`) |
| `short_description` | `text` | | Resumo curto para o card do catálogo |
| `description` | `text` | | Descrição completa para a página de detalhe |
| `stock` | `int` | NOT NULL, DEFAULT `0`, CHECK `>= 0` | Estoque disponível; 0 = indisponível |
| `featured` | `boolean` | NOT NULL, DEFAULT `false` | Aparece no carrossel/destaques da home |
| `active` | `boolean` | NOT NULL, DEFAULT `true` | Visível na vitrine pública |
| `ml_url` | `text` | | Link do anúncio no Mercado Livre |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Data de criação |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Atualizado por trigger |

**Regras**:
- `slug` gerado via `slugify(name)`; editável pelo admin antes de salvar.
- `active = false` → produto invisível na vitrine (nunca retornado nas queries públicas).
- `stock = 0` → botão de compra desabilitado (lógica no componente, não no banco).
- `ml_url` vazia → botão de compra não exibido, mesmo com `stock > 0`.
- Trigger `updated_at` deve atualizar automaticamente no UPDATE.

---

### `product_images`

Galeria de imagens de um produto. Armazena o path no Supabase Storage e a ordem.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Identificador único |
| `product_id` | `uuid` | NOT NULL, FK → `products.id` ON DELETE CASCADE | Produto ao qual pertence |
| `storage_path` | `text` | NOT NULL | Path do arquivo no Supabase Storage (ex: `products/abc123/1.png`) |
| `position` | `int` | NOT NULL, DEFAULT `1` | Ordem de exibição; `position = 1` é a imagem principal |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Data de criação |

**Regras**:
- `position = 1` é a imagem principal exibida nos cards do catálogo.
- Ao reordenar por drag-and-drop, atualizar `position` de todas as imagens do produto em uma única transação.
- ON DELETE CASCADE: ao excluir um produto, todas as imagens são excluídas automaticamente (arquivos no Storage devem ser removidos por Server Action separada).

---

### `admin_profiles`

Perfis dos usuários do painel. Vinculado a `auth.users` do Supabase Auth.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, FK → `auth.users(id)` ON DELETE CASCADE | Mesmo ID do Supabase Auth |
| `name` | `text` | NOT NULL | Nome de exibição do usuário |
| `role` | `text` | NOT NULL, CHECK (`role IN ('admin', 'editor')`) | Papel no sistema |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Data de criação |

**Regras**:
- Criação via Server Action exclusiva de admin (usa `service_role` key para criar em `auth.users` + inserir em `admin_profiles`).
- Deleção: verificar que `id != auth.uid()` antes de executar (guard no backend).
- `role` usado nas políticas RLS e na lógica de navegação do Sidebar.
- Senha gerenciada via fluxo de redefinição por e-mail do Supabase Auth — nunca armazenada aqui.

---

## Relacionamentos

```text
categories
  └── products (category_id FK, SET NULL on delete)
        └── product_images (product_id FK, CASCADE on delete)

auth.users
  └── admin_profiles (id FK, CASCADE on delete)
```

---

## RLS (Row Level Security)

Todas as tabelas expostas via Data API DEVEM ter RLS habilitado.

| Tabela | Acesso público (`anon`) | Acesso autenticado (`authenticated`) |
|--------|------------------------|--------------------------------------|
| `categories` | SELECT (todas) | SELECT (todas) |
| `products` | SELECT WHERE `active = true` | SELECT (todas, incluindo inativas) |
| `product_images` | SELECT (de produtos ativos) | SELECT (todas) |
| `admin_profiles` | Sem acesso | SELECT/INSERT/UPDATE/DELETE via role check |

**Nota**: INSERT, UPDATE e DELETE em `products`, `categories` e `product_images` são realizados via Server Actions que utilizam o `service_role` client — nunca expostos ao cliente via Data API. A RLS serve como camada de defesa em profundidade para as queries de SELECT públicas.

---

## Supabase Storage

**Bucket**: `product-images` (público)

**Path convention**: `products/{product_id}/{uuid}.png`

**Política**: leitura pública para servir imagens na vitrine. Upload/delete apenas via Server Actions autenticadas (usando `service_role`).

---

## Trigger: `updated_at`

```sql
-- Aplicado na tabela products
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```
