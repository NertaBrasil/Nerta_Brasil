"use client";

import { useState } from "react";
import type { Category } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { CategoryForm } from "./CategoryForm";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

type CategoryRowProps = {
  category: Category;
};

export function CategoryRow({ category }: CategoryRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <tr className="border-b border-navy-border">
      <td className="py-3 font-body text-sm text-white">{category.name}</td>
      <td className="py-3 font-body text-sm text-muted-text">{category.slug}</td>
      <td className="py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
            Editar
          </Button>
          <Button variant="danger-ghost" size="sm" onClick={() => setDeleteOpen(true)}>
            Excluir
          </Button>
        </div>

        <Modal
          open={editOpen}
          title="Editar categoria"
          onClose={() => setEditOpen(false)}
          hideFooter
        >
          <CategoryForm category={category} onSuccess={() => setEditOpen(false)} />
        </Modal>

        <DeleteCategoryModal
          category={category}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
        />
      </td>
    </tr>
  );
}
