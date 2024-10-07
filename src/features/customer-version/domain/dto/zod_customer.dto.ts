import z from "zod";

export const customerVersionSchemaDto = z.object({
  id: z
    .number()
    .int({ message: "O campo 'id' deve ser um número inteiro." })
    .positive({ message: "O campo 'id' deve ser um número positivo." })
    .optional(),
  customer_id: z
    .number()
    .min(1, { message: "O campo 'customer_id' não pode estar vazio." }),
  system_id: z
    .number()
    .int({ message: "O campo 'system_id' deve ser um número inteiro." })
    .positive({ message: "O campo 'system_id' deve ser um número positivo." }),
  version: z.string(),
  assigned_date: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },
    z.date({ message: "O campo 'assigned_date' deve ser uma data válida." })
  ),
  createdAt: z
    .date({
      message: "O campo 'createdAt' deve ser uma data válida.",
    })
    .optional(),
  updatedAt: z
    .date({
      message: "O campo 'updatedAt' deve ser uma data válida.",
    })
    .optional(),
  deletedAt: z
    .date({ message: "O campo 'deletedAt' deve ser uma data válida." })
    .nullable()
    .optional(),
});

export type TCustomerVersionDto = z.infer<typeof customerVersionSchemaDto>;
