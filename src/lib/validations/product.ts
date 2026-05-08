import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Ürün adı gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  price: z.coerce.number().positive("Fiyat pozitif olmalı"),
  salePrice: z.coerce.number().positive().nullable().optional(),
  sku: z.string().nullable().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  isProject: z.boolean().default(false),
  categoryId: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
});

export const productDimensionsSchema = z.object({
  width: z.coerce.number().positive("Genişlik pozitif olmalı"),
  height: z.coerce.number().positive("Yükseklik pozitif olmalı"),
  depth: z.coerce.number().positive("Derinlik pozitif olmalı"),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductDimensionsFormData = z.infer<typeof productDimensionsSchema>;
