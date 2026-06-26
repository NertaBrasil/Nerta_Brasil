"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DeleteUserModal } from "./DeleteUserModal";
import type { AdminProfile } from "../types";

type UserRowProps = {
  user: AdminProfile;
  currentUserId: string;
};

export function UserRow({ user, currentUserId }: UserRowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isSelf = user.id === currentUserId;

  return (
    <tr className="border-b border-navy-border">
      <td className="py-3 font-body text-sm text-white">{user.name}</td>
      <td className="py-3 font-body text-sm text-muted-text">{user.email}</td>
      <td className="py-3">
        <Badge tone={user.role === "admin" ? "gold" : user.role === "partner_viewer" ? "teal" : "blue"}>
          {user.role === "partner_viewer" ? "Parcerias" : user.role}
        </Badge>
      </td>
      <td className="py-3 text-right">
        {isSelf ? (
          <span className="font-body text-sm text-muted-text">Você</span>
        ) : (
          <Button variant="danger-ghost" size="sm" onClick={() => setDeleteOpen(true)}>
            Excluir
          </Button>
        )}
        {!isSelf && (
          <DeleteUserModal user={user} open={deleteOpen} onClose={() => setDeleteOpen(false)} />
        )}
      </td>
    </tr>
  );
}
