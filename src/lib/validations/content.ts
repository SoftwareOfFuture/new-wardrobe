import { z } from "zod";

export const contentSectionSchema = z.object({
  title: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
  imageUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  metadata: z.string().nullable().optional(),
});

export type ContentSectionFormData = z.infer<typeof contentSectionSchema>;
