import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import { CategoryList, CategoryForm } from "@/features/admin/categories";

export default async function AdminCategoriesPage() {
  const profile = await getCurrentAdminProfile();
  if (profile?.role === "partner_viewer") redirect("/admin/parcerias");

  return (
    <div>
      <h1 className="text-h2">Categorias</h1>

      <div className="mt-6">
        <CategoryForm />
      </div>

      <div className="mt-8">
        <CategoryList />
      </div>
    </div>
  );
}
