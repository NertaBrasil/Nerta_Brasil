# Queries & Server Actions — Contratos por Domínio

**Date**: 2026-06-16 (revisado após refino de arquitetura)
**Types**: [types.ts](./types.ts)

Duas categorias distintas de função, nunca misturadas no mesmo arquivo:

- **Queries** (`queries.ts`): funções de leitura simples, sem `"use server"`, chamadas direto por Server Components. Sem checagem de papel — leitura pública ou já protegida pelo contexto da página.
- **Server Actions** (`actions.ts`): funções `"use server"`, invocadas por Client Components. Sempre seguem a ordem: validar sessão/papel → validar input via `schemas.ts` → mutar → retornar `ActionResult<T>` (nunca lançam exceção para o cliente).

---

## Sessão admin (`features/admin/auth/session.ts`)

### `getCurrentAdminProfile()`
```ts
getCurrentAdminProfile(): Promise<AdminProfile | null>
```
Envolvido em `cache()` do React — uma única consulta ao banco por request, mesmo se chamado por `(admin)/layout.tsx` e por uma página filha no mesmo render. Retorna `null` se não houver sessão válida (não deveria ocorrer dentro de `/admin/*`, já filtrado pelo middleware).

---

## Queries — Vitrine pública (`features/produtos/queries.ts`)

### `getProducts(filters?)`
```ts
getProducts(filters?: {
  category_slug?: string;
  line?: string;
}): Promise<ProductCard[]>
```
Retorna produtos com `active = true`. Filtro por categoria e/ou linha. Ordenados por `name ASC`. Inclui `cover_image` (position=1).

### `getProductBySlug(slug)`
```ts
getProductBySlug(slug: string): Promise<Product | null>
```
Retorna produto completo com todas as imagens ordenadas por `position ASC`. Retorna `null` se não encontrado ou `active = false`.

### `getFeaturedProducts()`
```ts
getFeaturedProducts(): Promise<ProductCard[]>
```
Retorna produtos com `featured = true` e `active = true`. Usado na seção de destaques da home.

### `getCategories()`
```ts
getCategories(): Promise<Category[]>
```
Retorna todas as categorias ordenadas por `name ASC`. Usado nos filtros do catálogo e nos formulários admin.

---

## Server Actions — Admin Produtos (`features/admin/produtos/actions.ts`)

> Todas chamam `getCurrentAdminProfile()` e exigem `role IN ('admin', 'editor')`.

### `createProduct(input)`
```ts
createProduct(input: CreateProductInput): Promise<ActionResult<Product>>
```
Valida `input` via `productSchema` (`schemas.ts`) antes de inserir.

### `updateProduct(input)`
```ts
updateProduct(input: UpdateProductInput): Promise<ActionResult<Product>>
```

### `deleteProduct(id)`
```ts
deleteProduct(id: string): Promise<ActionResult>
```
Exclui produto e todas as imagens vinculadas (cascade). Remove arquivos do Supabase Storage.

### `uploadProductImage(product_id, file)`
```ts
uploadProductImage(
  product_id: string,
  file: File
): Promise<ActionResult<ProductImage>>
```
Faz upload do arquivo (já recortado 1:1 no client) para `products/{product_id}/{uuid}.png` no Storage. Insere registro em `product_images` com `position` = último + 1.

### `deleteProductImage(image_id)`
```ts
deleteProductImage(image_id: string): Promise<ActionResult>
```
Remove arquivo do Storage e o registro em `product_images`.

### `reorderProductImages(input)`
```ts
reorderProductImages(input: ReorderImagesInput): Promise<ActionResult>
```
Atualiza `position` de todas as imagens do produto em uma única transação.

---

## Server Actions — Admin Categorias (`features/admin/categorias/actions.ts`)

> Todas exigem `role IN ('admin', 'editor')`.

### `createCategory(input)`
```ts
createCategory(input: CreateCategoryInput): Promise<ActionResult<Category>>
```
Valida via `categorySchema`.

### `updateCategory(input)`
```ts
updateCategory(input: UpdateCategoryInput): Promise<ActionResult<Category>>
```

### `deleteCategory(id)`
```ts
deleteCategory(id: string): Promise<ActionResult>
```
**Bloqueado** se existirem produtos vinculados. Retorna `{ success: false, error: "Categoria possui produtos vinculados. Reclassifique os produtos antes de excluir." }`.

---

## Server Actions — Admin Destaques (`features/admin/destaques/actions.ts`)

> Exige `role IN ('admin', 'editor')`.

### `toggleFeatured(product_id, featured)`
```ts
toggleFeatured(
  product_id: string,
  featured: boolean
): Promise<ActionResult>
```
Atualiza `products.featured` para o valor informado.

---

## Server Actions — Admin Usuários (`features/admin/usuarios/actions.ts`)

> **Exclusivo para `role = 'admin'`** — checagem feita dentro da action, não apenas na UI.

### `createUser(input)`
```ts
createUser(input: CreateUserInput): Promise<ActionResult<AdminProfile>>
```
Valida via `userSchema`. Cria usuário em `auth.users` via Admin API (`service_role`) e insere em `admin_profiles`. Envia e-mail de definição de senha.

### `deleteUser(id)`
```ts
deleteUser(id: string): Promise<ActionResult>
```
**Bloqueado** se `id === (await getCurrentAdminProfile())?.id` (admin não pode deletar a própria conta). Remove de `auth.users` (cascade remove `admin_profiles`).

### `getAdminUsers(id)`
```ts
getAdminUsers(): Promise<AdminProfile[]>
```
Lista todos os usuários do painel com nome, e-mail e papel. Tecnicamente uma leitura, mas vive em `actions.ts` (não `queries.ts`) porque exige `role = 'admin'` — a separação queries/actions é sobre *quem pode chamar*, não sobre verbo HTTP.

---

## Server Actions — Shell (`features/shell/actions.ts`)

### `logout()`
```ts
logout(): Promise<void>
```
Invalida a sessão Supabase e redireciona para `/admin/login`.
