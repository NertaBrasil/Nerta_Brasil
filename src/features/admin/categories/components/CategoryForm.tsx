"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { slugify } from "@/shared/utils";
import type { Category } from "@/features/products";
import { createCategory, updateCategory } from "../actions";

type CategoryFormProps = {
  category?: Category;
  onSuccess?: () => void;
};

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!slug) {
      setError("Slug é obrigatório.");
      return;
    }

    setPending(true);
    const result = category
      ? await updateCategory({ id: category.id, name, slug })
      : await createCategory({ name, slug });
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    if (!category) {
      setName("");
      setSlug("");
      setSlugTouched(false);
    }

    router.refresh();
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Nome"
        required
        value={name}
        onChange={(event) => handleNameChange(event.target.value)}
      />
      <Input
        label="Slug"
        required
        hint="Identifica a categoria na URL pública do catálogo. Gerado automaticamente a partir do nome — edite só se quiser um valor específico."
        value={slug}
        onChange={(event) => handleSlugChange(event.target.value)}
      />
      {error && (
        <p className="font-body text-sm text-[#E5634D] sm:col-span-2" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        Salvar
      </Button>
    </form>
  );
}
