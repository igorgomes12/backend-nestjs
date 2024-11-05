import { z } from "zod";
export const AddressSchema = z.object({
  id: z.number().int().positive().optional(),
  identifier: z.string().uuid().optional(),
  street: z.string().min(1),
  complement: z.string().nullable().optional(),
  postal_code: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  municipality_id: z.number().int().optional(),
  municipality_name: z.string().min(1),
  state_id: z.number().int().optional(),
  state: z.string().min(1),
  country_id: z.number().int().optional(),
  region_id: z.number().int().optional(),
  description: z.string().nullable().optional(),
  favorite: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
  clientId: z.number().int().optional(),
});

export type TAddress = z.infer<typeof AddressSchema>;
