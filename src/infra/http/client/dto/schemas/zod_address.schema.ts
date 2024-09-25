import { z } from "zod";

export const AddressSchema = z.object({
  id: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'id', se fornecido, deve ser um número inteiro positivo.",
    })
    .optional(),
  identifier: z
    .string()
    .uuid({
      message: "O campo 'identifier', se fornecido, deve ser um UUID válido.",
    })
    .optional(),
  street: z.string().min(1, {
    message: "O campo 'street' é obrigatório e não pode estar vazio.",
  }),
  complement: z.string().nullable().optional(),
  postal_code: z.string().min(1, {
    message: "O campo 'postal_code' é obrigatório e não pode estar vazio.",
  }),
  number: z.string().min(1, {
    message: "O campo 'number' é obrigatório e não pode estar vazio.",
  }),
  neighborhood: z.string().min(1, {
    message: "O campo 'neighborhood' é obrigatório e não pode estar vazio.",
  }),
  municipality_id: z.number().int().positive({
    message:
      "O campo 'municipality_id' é obrigatório e deve ser um número inteiro positivo.",
  }),
  municipality_name: z.string().min(1, {
    message:
      "O campo 'municipality_name' é obrigatório e não pode estar vazio.",
  }),
  state_id: z.number().int().positive({
    message:
      "O campo 'state_id' é obrigatório e deve ser um número inteiro positivo.",
  }),
  state: z.string().min(1, {
    message: "O campo 'state' é obrigatório e não pode estar vazio.",
  }),
  country_id: z.number().int().positive({
    message:
      "O campo 'country_id' é obrigatório e deve ser um número inteiro positivo.",
  }),
  region_id: z.number().int().positive({
    message:
      "O campo 'region_id' é obrigatório e deve ser um número inteiro positivo.",
  }),
  description: z.string().nullable().optional(),
  main: z.boolean({
    message: "O campo 'main' é obrigatório e deve ser um valor booleano.",
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

export type TAddress = z.infer<typeof AddressSchema>;
