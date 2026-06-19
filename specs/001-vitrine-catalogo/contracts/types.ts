/**
 * Tipos TypeScript compartilhados entre features.
 * Este arquivo é a fonte da verdade para os contratos de dados do projeto.
 * Gerado durante o planejamento — NÃO é código de produção ainda.
 *
 * Mapeamento para a árvore real (ver "Code Architecture Conventions" em plan.md):
 *   Category, ProductImage, Product, ProductCard → features/products/types.ts
 *   AdminRole, AdminProfile                       → features/admin/users/types.ts
 *   CreateProductInput, UpdateProductInput,
 *   ReorderImagesInput                             → features/admin/products/types.ts
 *   CreateCategoryInput, UpdateCategoryInput        → features/admin/categories/types.ts
 *   CreateUserInput                                 → features/admin/users/types.ts
 *   ActionResult                                    → shared/types.ts (genérico, sem domínio)
 *
 * Cada feature importa apenas o que precisa via `import type`, nunca o barrel
 * inteiro de outra feature.
 */

// ---------------------------------------------------------------------------
// Domínio público (vitrine) — dono: features/products/types.ts
// ---------------------------------------------------------------------------

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  /** URL pública no Supabase Storage */
  url: string;
  position: number;
  created_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  line: string;
  category_id: string | null;
  category: Category | null;
  dilution: string | null;
  attributes: string[];
  short_description: string | null;
  description: string | null;
  stock: number;
  featured: boolean;
  active: boolean;
  ml_url: string | null;
  images: ProductImage[];
  /** Primeira imagem (position=1), ou null se sem imagens */
  cover_image: ProductImage | null;
  created_at: string;
  updated_at: string;
};

/** Versão resumida usada nos cards do catálogo */
export type ProductCard = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "line"
  | "category"
  | "short_description"
  | "stock"
  | "featured"
  | "active"
  | "ml_url"
> & {
  cover_image: ProductImage | null;
};

// ---------------------------------------------------------------------------
// Domínio admin
// ---------------------------------------------------------------------------

export type AdminRole = "admin" | "editor";

export type AdminProfile = {
  id: string;
  name: string;
  role: AdminRole;
  created_at: string;
  /** E-mail vem de auth.users, não de admin_profiles */
  email: string;
};

// ---------------------------------------------------------------------------
// Inputs de formulários (Server Actions)
// ---------------------------------------------------------------------------

export type CreateProductInput = {
  name: string;
  line: string;
  category_id: string | null;
  dilution: string | null;
  attributes: string[];
  short_description: string | null;
  description: string | null;
  stock: number;
  featured: boolean;
  active: boolean;
  ml_url: string | null;
};

export type UpdateProductInput = Partial<CreateProductInput> & {
  id: string;
};

export type CreateCategoryInput = {
  name: string;
  slug: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput> & {
  id: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  role: AdminRole;
};

export type ReorderImagesInput = {
  product_id: string;
  /** Array de IDs de imagem na nova ordem (index 0 = position 1) */
  image_ids: string[];
};

// ---------------------------------------------------------------------------
// Respostas de Server Actions
// ---------------------------------------------------------------------------

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
