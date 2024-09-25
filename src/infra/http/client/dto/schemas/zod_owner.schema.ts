import { z } from "zod";

export const OwnerSchema = z.object({
  id: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'id', se fornecido, deve ser um número inteiro positivo.",
    })
    .optional(),
  name: z.string().min(1, {
    message: "O campo 'name' é obrigatório e não pode estar vazio.",
  }),
  cpf_cnpj: z
    .string()
    .min(11, {
      message: "O campo 'cpf_cnpj' deve ter no mínimo 11 caracteres.",
    })
    .max(14, {
      message: "O campo 'cpf_cnpj' deve ter no máximo 14 caracteres.",
    }),
  birth_date: z.string().transform((val) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error("Data de nascimento inválida.");
    }
    return date;
  }),
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
    .optional(),
});

export type TOwner = z.infer<typeof OwnerSchema>;
