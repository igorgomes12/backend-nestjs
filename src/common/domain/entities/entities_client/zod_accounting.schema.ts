import { z } from "zod";

export const AccountingSchema = z.object({
  accounting_id: z.number().int().positive({
    message:
      "O campo 'accounting_id' é obrigatório e deve ser um número inteiro positivo.",
  }),
  observation: z
    .string()
    .min(3, { message: "Favor digitar os dados completos!" }),
  establishment_type_id: z.number().int().positive({
    message:
      "O campo 'establishment_type_id' é obrigatório e deve ser um número inteiro positivo.",
  }),
  taxation_type_id: z.number().int().positive().nullable().optional(),
  status: z
    .string()
    .min(1, { message: "O campo 'status' é obrigatório." })
    .max(50, { message: "O campo 'status' não pode exceder 50 caracteres." }),
  company_id: z.number().int().positive().default(1),
  representative_id: z.number().int().positive().nullable().optional(),
  owner_id: z.number().int().positive().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
  clientId: z
    .number()
    .int()
    .positive()
    .optional()
    .refine((val) => val === undefined || val > 0, {
      message: "O campo 'clientId', se fornecido, deve ser um número positivo.",
    }),
});

export type TAccounting = z.infer<typeof AccountingSchema>;
