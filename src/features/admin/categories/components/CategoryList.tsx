import { getCategories } from "@/features/products";
import { CategoryRow } from "./CategoryRow";

export async function CategoryList() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return <p className="font-body text-sm text-muted-text">Nenhuma categoria cadastrada.</p>;
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-navy-border">
          <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
            Nome
          </th>
          <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
            Slug
          </th>
          <th className="py-3" />
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </tbody>
    </table>
  );
}
