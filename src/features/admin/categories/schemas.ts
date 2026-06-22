import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug é obrigatório.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug inválido."),
});

export type CreateCategoryInput = z.infer<typeof categorySchema>;

export const updateCategorySchema = categorySchema.extend({
  id: z.string().min(1),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
