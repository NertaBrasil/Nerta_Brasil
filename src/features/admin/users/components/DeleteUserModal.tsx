"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/shared/components/ui/Modal";
import { deleteUser } from "../actions";

type DeleteUserModalProps = {
  user: { id: string; name: string };
  open: boolean;
  onClose: () => void;
};

export function DeleteUserModal({ user, open, onClose }: DeleteUserModalProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setPending(true);
    const result = await deleteUser(user.id);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <Modal
      open={open}
      title="Excluir usuário"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmLabel={pending ? "Excluindo..." : "Excluir"}
      destructive
    >
      <p>
        Tem certeza que deseja excluir permanentemente o usuário <strong>{user.name}</strong>? Esta
        ação não pode ser desfeita.
      </p>
      {error && <p className="mt-2 text-[#E5634D]">{error}</p>}
    </Modal>
  );
}
