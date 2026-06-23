import { CategoryList, CategoryForm } from "@/features/admin/categories";

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-h2">Categorias</h1>

      <div className="mt-6 max-w-3xl">
        <CategoryForm />
      </div>

      <div className="mt-8">
        <CategoryList />
      </div>
    </div>
  );
}
