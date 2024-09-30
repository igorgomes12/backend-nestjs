import { z } from "zod";
export const AddressSchema = z.object({
  id: z.number().int().positive().optional(),
  identifier: z.string().uuid().optional(),
  street: z.string().min(1),
  complement: z.string().nullable().optional(),
  postal_code: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  municipality_id: z.number().int().positive(),
  municipality_name: z.string().min(1),
  state_id: z.number().int().positive(),
  state: z.string().min(1),
  country_id: z.number().int().positive(),
  region_id: z.number().int().positive(),
  description: z.string().nullable().optional(),
  main: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
  clientId: z.number().int().positive().optional(),
});

export type TAddress = z.infer<typeof AddressSchema>;
