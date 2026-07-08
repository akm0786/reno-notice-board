import { z } from "zod";

export const noticeInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  body: z.string().trim().min(1, "Body is required").max(5000),
  category: z.enum(["EXAM", "EVENT", "GENERAL"]),
  priority: z.enum(["NORMAL", "URGENT"]),
  publishDate: z
    .string()
    .min(1, "Publish date is required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
  imageUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type NoticeInput = z.infer<typeof noticeInputSchema>;
