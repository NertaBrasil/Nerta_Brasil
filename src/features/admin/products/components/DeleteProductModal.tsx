"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/shared/components/ui/Modal";
import { deleteProduct } from "../actions";

type DeleteProductModalProps = {
  product: { id: string; name: string };
  open: boolean;
  onClose: () => void;
};

export function DeleteProductModal({ product, open, onClose }: DeleteProductModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    const result = await deleteProduct(product.id);
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
      title="Excluir produto"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmLabel={pending ? "Excluindo..." : "Excluir"}
      destructive
    >
      <p>
        Tem certeza que deseja excluir o produto <strong>{product.name}</strong>? Esta ação é
        permanente.
      </p>
      {error && (
        <p className="mt-3 text-[#E5634D]" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}
