import { z } from "zod";

const ML_URL_REQUIRED_ERROR =
  "Link do Mercado Livre é obrigatório quando o modo de compra é 'Link Mercado Livre'.";

const productFields = z.object({
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
  purchase_mode: z.enum(["mercado_livre", "formulario_parceria"]).default("mercado_livre"),
});

function requireMlUrlWhenMercadoLivre(
  data: { purchase_mode: string; ml_url: string | null },
  ctx: z.RefinementCtx
) {
  if (data.purchase_mode === "mercado_livre" && !data.ml_url) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ML_URL_REQUIRED_ERROR, path: ["ml_url"] });
  }
}

export const productSchema = productFields.superRefine(requireMlUrlWhenMercadoLivre);

export type CreateProductInput = z.infer<typeof productSchema>;

export const updateProductSchema = productFields
  .extend({ id: z.string().min(1) })
  .superRefine(requireMlUrlWhenMercadoLivre);

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
