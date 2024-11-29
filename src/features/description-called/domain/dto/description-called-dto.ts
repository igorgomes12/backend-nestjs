import { z } from "zod";

export const descriptionCalledSchema = z.object({
  id: z.number().optional(),
  public_id: z.string().optional(),
  description: z.string().min(3, "Descrição é obrigatória"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export type TDescriptionCalledSchema = z.infer<typeof descriptionCalledSchema>;
