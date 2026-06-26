"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Textarea } from "@/shared/components/ui/Textarea";
import { Button } from "@/shared/components/ui/Button";
import { slugify } from "@/shared/utils";
import type { Category, Product, PurchaseMode } from "@/features/products";
import { createProduct, updateProduct } from "../actions";

const PURCHASE_MODE_OPTIONS = [
  { value: "mercado_livre", label: "Link Mercado Livre" },
  { value: "formulario_parceria", label: "Formulário de Parceria" },
];

type ProductFormProps = {
  categories: Category[];
  product?: Product;
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [line, setLine] = useState(product?.line ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [dilution, setDilution] = useState(product?.dilution ?? "");
  const [attributes, setAttributes] = useState(product?.attributes.join(", ") ?? "");
  const [shortDescription, setShortDescription] = useState(product?.short_description ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : "");
  const [active, setActive] = useState(product?.active ?? true);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>(
    product?.purchase_mode ?? "mercado_livre"
  );
  const [mlUrl, setMlUrl] = useState(product?.ml_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const input = {
      name,
      slug,
      line,
      category_id: categoryId,
      dilution: dilution || null,
      attributes: attributes
        .split(",")
        .map((attribute) => attribute.trim())
        .filter(Boolean),
      short_description: shortDescription || null,
      description: description || null,
      stock: Number(stock),
      price: price ? Number(price) : null,
      active,
      purchase_mode: purchaseMode,
      ml_url: purchaseMode === "mercado_livre" ? mlUrl || null : null,
    };

    const result = product
      ? await updateProduct({ id: product.id, ...input })
      : await createProduct(input);

    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/admin/produtos");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Input label="Nome" required value={name} onChange={(e) => handleNameChange(e.target.value)} />
      <Input
        label="Slug"
        required
        hint="Identifica o produto na URL pública (ex: /produtos/nerta-agro-power). Gerado automaticamente a partir do nome — edite só se quiser um valor específico."
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value);
        }}
      />
      <Input
        label="Linha comercial"
        required
        value={line}
        onChange={(e) => setLine(e.target.value)}
      />
      <Select
        label="Categoria"
        placeholder="Selecione uma categoria"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={categories.map((category) => ({ value: category.id, label: category.name }))}
      />
      <Input label="Diluição" value={dilution ?? ""} onChange={(e) => setDilution(e.target.value)} />
      <Input
        label="Atributos (separados por vírgula)"
        value={attributes}
        onChange={(e) => setAttributes(e.target.value)}
      />
      <Textarea
        label="Descrição curta"
        rows={2}
        value={shortDescription ?? ""}
        onChange={(e) => setShortDescription(e.target.value)}
        containerClassName="sm:col-span-2"
      />
      <Textarea
        label="Descrição completa"
        rows={5}
        value={description ?? ""}
        onChange={(e) => setDescription(e.target.value)}
        containerClassName="sm:col-span-2"
      />
      <Input
        label="Estoque"
        type="number"
        min={0}
        required
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <Input
        label="Preço (R$)"
        type="number"
        min={0}
        step={0.01}
        hint="Opcional. Deixe em branco se o preço não for exibido publicamente."
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Select
        label="Modo de compra"
        value={purchaseMode}
        onChange={(e) => setPurchaseMode(e.target.value as PurchaseMode)}
        options={PURCHASE_MODE_OPTIONS}
      />
      {purchaseMode === "mercado_livre" && (
        <Input
          label="Link Mercado Livre"
          value={mlUrl ?? ""}
          onChange={(e) => setMlUrl(e.target.value)}
          containerClassName="sm:col-span-2"
        />
      )}
      <label className="flex items-center gap-2 font-body text-sm text-light-gray sm:col-span-2">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Produto ativo (visível na vitrine pública)
      </label>
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
