import { createClient } from "@/infrastructure/supabase/server";

export type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  featured_position: number;
};

const FEATURED_SELECT = "id, name, slug, active, featured_position";

export async function getFeaturedProductsForAdmin(): Promise<FeaturedProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(FEATURED_SELECT)
    .eq("featured", true)
    .order("featured_position", { ascending: true });

  if (error) throw error;

  return (data ?? []) as unknown as FeaturedProduct[];
}
