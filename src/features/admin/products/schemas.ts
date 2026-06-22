import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug é obrigatório.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug inválido."),
  line: z.string().trim().min(1, "Linha comercial é obrigatória."),
  category_id: z.string().min(1, "Categoria é obrigatória."),
  dilution: z.string().trim().nullable().default(null),
  attributes: z.array(z.string()).default([]),
  short_description: z.string().trim().nullable().default(null),
  description: z.string().trim().nullable().default(null),
  stock: z.coerce.number().int().nonnegative("Estoque deve ser um número inteiro não-negativo."),
  active: z.boolean(),
  ml_url: z.string().trim().nullable().default(null),
});

export type CreateProductInput = z.infer<typeof productSchema>;

export const updateProductSchema = productSchema.extend({
  id: z.string().min(1),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
