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
  cover_image: ProductImage | null;
  created_at: string;
  updated_at: string;
};

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
