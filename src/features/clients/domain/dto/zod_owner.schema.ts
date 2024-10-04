import { z } from "zod";

export const OwnerSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  cpf_cnpj: z.string().min(11).max(14),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
  clientId: z.number().int().positive().optional(),
});

export type TOwner = z.infer<typeof OwnerSchema>;
