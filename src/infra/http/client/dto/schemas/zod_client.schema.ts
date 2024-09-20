import { z } from "zod";
import { AccountingSchema, AddressSchema, ContactSchema, OwnerSchema } from ".";

export const ClientSchema = z.object({
  id: z.number().int().positive().optional(), 
  identifier: z.string().uuid().optional(), 
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
  deletedAt: z.date().nullable().optional(), 
  corporate_name: z.string().min(1), 
  fantasy_name: z.string().min(1), 
  contacts: z.array(ContactSchema), 
  cpf_cnpj: z.string().min(11).max(14), 
  state_registration: z.string().min(1), 
  municipal_registration: z.string().nullable().optional(), 
  rural_registration: z.string().nullable().optional(), 
  address: z.array(AddressSchema), 
  accounting: z.array(AccountingSchema),
  owner: z.array(OwnerSchema), 
});

export type TClient = z.infer<typeof ClientSchema>;
