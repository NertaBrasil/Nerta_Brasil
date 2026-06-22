import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import { UserList, UserForm } from "@/features/admin/users";

export default async function AdminUsersPage() {
  const profile = await getCurrentAdminProfile();
  if (profile?.role !== "admin") redirect("/admin");

  return (
    <div>
      <h1 className="text-h2">Usuários</h1>

      <div className="mt-6 max-w-md">
        <UserForm />
      </div>

      <div className="mt-10">
        <UserList />
      </div>
    </div>
  );
}
