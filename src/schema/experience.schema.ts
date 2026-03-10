import { z } from "zod";

export const experienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(),
  author: z.string().optional(),
  yearCreated: z.number().optional().nullable(),
  material: z.string().optional(),
  period: z.string().optional(),
  audioLocation: z.string().optional(),
  storageLocation: z.string().optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
