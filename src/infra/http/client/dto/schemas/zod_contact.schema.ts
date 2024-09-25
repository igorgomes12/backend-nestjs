import { z } from "zod";

export const TypeEnum = z.enum(["TELEFONE", "CELULAR", "EMAIL", "WHATSAPP"]);

export const ContactSchema = z.object({
  id: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'id', se fornecido, deve ser um número inteiro positivo.",
    })
    .optional(),
  description: z.string().min(1, {
    message: "O campo 'description' é obrigatório e não pode estar vazio.",
  }),
  contact: z.string().min(1, {
    message: "O campo 'contact' é obrigatório e não pode estar vazio.",
  }),
  type: TypeEnum.default("CELULAR").refine(
    (val) => TypeEnum.options.includes(val),
    {
      message:
        "O campo 'type' deve ser um dos seguintes: TELEFONE, CELULAR, EMAIL, WHATSAPP.",
    }
  ),
  main_account: z.boolean({
    message:
      "O campo 'main_account' é obrigatório e deve ser um valor booleano.",
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

export type TContact = z.infer<typeof ContactSchema>;
