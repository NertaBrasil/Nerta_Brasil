import { getCurrentAdminProfile } from "@/features/admin/auth";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { getAdminUsers } from "../actions";
import { UserRow } from "./UserRow";

export async function UserList() {
  const profile = await getCurrentAdminProfile();
  const result = await getAdminUsers();

  if (!result.success) {
    return <p className="font-body text-sm text-[#E5634D]">{result.error}</p>;
  }

  if (result.data.length === 0) {
    return (
      <EmptyState
        title="Nenhum usuário cadastrado"
        description="Use o formulário acima para criar o primeiro usuário administrativo."
      />
    );
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-navy-border">
          <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
            Nome
          </th>
          <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
            E-mail
          </th>
          <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
            Papel
          </th>
          <th className="py-3" />
        </tr>
      </thead>
      <tbody>
        {result.data.map((user) => (
          <UserRow key={user.id} user={user} currentUserId={profile?.id ?? ""} />
        ))}
      </tbody>
    </table>
  );
}
