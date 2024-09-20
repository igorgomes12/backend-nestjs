import {z} from "zod"

export const AccountingSchema = z.object({
    accounting_id: z.number().int().positive().optional(), 
    observation: z.string().nullable().optional(),
    establishment_type_id: z.number().int().positive(),
    taxation_type_id: z.number().int().positive().nullable().optional(),
    status: z.string().min(1),
    company_id: z.number().int().positive().default(1), 
    representative_id: z.number().int().positive().nullable().optional(),
    owner_id: z.number().int().positive().nullable().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(), 
    deletedAt: z.date().nullable().optional(), 
    clientId: z.number().int().positive().optional(), 
  });
  
  export type TAccounting = z.infer<typeof AccountingSchema>