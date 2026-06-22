"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/shared/components/ui/Modal";
import type { Category } from "@/features/products";
import { deleteCategory } from "../actions";

type DeleteCategoryModalProps = {
  category: Category;
  open: boolean;
  onClose: () => void;
};

export function DeleteCategoryModal({ category, open, onClose }: DeleteCategoryModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    const result = await deleteCategory(category.id);
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
      title="Excluir categoria"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmLabel={pending ? "Excluindo..." : "Excluir"}
      destructive
    >
      <p>
        Tem certeza que deseja excluir a categoria <strong>{category.name}</strong>?
      </p>
      {error && (
        <p className="mt-3 text-[#E5634D]" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}
