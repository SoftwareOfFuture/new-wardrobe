import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  parentId: z.string().nullable().optional(),
  order: z.coerce.number().int().min(0).default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
