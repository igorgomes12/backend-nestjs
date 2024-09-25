import { z } from "zod";

export const AccountingSchema = z.object({
  accounting_id: z.number().int().positive({
    message:
      "O campo 'accounting_id' é obrigatório e deve ser um número inteiro positivo.",
  }),
  observation: z.string().min(3, {
    message: "Favor digitar os dados completos!",
  }),
  establishment_type_id: z.number().int().positive({
    message:
      "O campo 'establishment_type_id' é obrigatório e deve ser um número inteiro positivo.",
  }),
  taxation_type_id: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'taxation_type_id' deve ser um número inteiro positivo, se fornecido.",
    })
    .nullable()
    .optional(),
  status: z
    .string()
    .min(1, {
      message: "O campo 'status' é obrigatório.",
    })
    .max(50, {
      message: "O campo 'status' não pode exceder 50 caracteres.",
    }),
  company_id: z
    .number()
    .int()
    .positive({
      message: "O campo 'company_id' deve ser um número inteiro positivo.",
    })
    .default(1),
  representative_id: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'representative_id' deve ser um número inteiro positivo, se fornecido.",
    })
    .nullable()
    .optional(),
  owner_id: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'owner_id' deve ser um número inteiro positivo, se fornecido.",
    })
    .nullable()
    .optional(),
  createdAt: z
    .date({
      message: "O campo 'createdAt' deve ser uma data válida, se fornecido.",
    })
    .optional(),
  updatedAt: z
    .date({
      message: "O campo 'updatedAt' deve ser uma data válida, se fornecido.",
    })
    .optional(),
  deletedAt: z
    .date({
      message:
        "O campo 'deletedAt' deve ser uma data válida ou nula, se fornecido.",
    })
    .nullable()
    .optional(),
  clientId: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'clientId', se fornecido, deve ser um número inteiro positivo.",
    })
    .optional()
    .refine((val) => val === undefined || val > 0, {
      message: "O campo 'clientId', se fornecido, deve ser um número positivo.",
    }),
});

export type TAccounting = z.infer<typeof AccountingSchema>;
