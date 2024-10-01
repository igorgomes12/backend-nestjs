import { formatCpfOrCnpj } from "@infra/utils/regex/cpf-cnpj";
import { z } from "zod";
import { AddressSchema, ContactSchema, OwnerSchema } from ".";

export const ClientSchema = z.object({
  id: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'id' é obrigatório e deve ser um número inteiro positivo.",
    })
    .optional(),

  identifier: z
    .string()
    .uuid({
      message: "O campo 'identifier' deve ser um UUID válido.",
    })
    .optional(),

  createdAt: z
    .string()
    .datetime({
      message:
        "O campo 'createdAt' deve ser uma data válida no formato ISO 8601.",
    })
    .optional(),

  updatedAt: z
    .string()
    .datetime({
      message:
        "O campo 'updatedAt' deve ser uma data válida no formato ISO 8601.",
    })
    .optional(),

  deletedAt: z.string().datetime().nullable().optional(),

  corporate_name: z.string().nonempty("Corporate name is required"),

  fantasy_name: z.string().optional(),

  contacts: z
    .array(ContactSchema)
    .min(1, { message: "É necessário fornecer pelo menos um contato." })
    .max(5, { message: "O número máximo de contatos permitidos é 5." }),

  cpf_cnpj: z
    .string()
    .min(11, {
      message: "O campo 'cpf_cnpj' deve ter no mínimo 11 caracteres.",
    })
    .max(18, {
      message: "O campo 'cpf_cnpj' deve ter no máximo 18 caracteres.",
    })
    .transform((val) => formatCpfOrCnpj(val)),

  state_registration: z.string().min(1, {
    message: "O campo 'state_registration' é obrigatório.",
  }),

  municipal_registration: z.string().nullable(),
  rural_registration: z.string().nullable(),

  address: z
    .array(AddressSchema)
    .min(1, { message: "É necessário fornecer pelo menos um endereço." })
    .max(10, { message: "O número máximo de endereços permitidos é 10." }),

  name_account: z.string(),
  id_account: z.number().int().positive({
    message: "O campo 'id_account' deve ser um número inteiro positivo.",
  }),
  establishment_typeId: z.number().int().positive({
    message:
      "O campo 'establishment_typeId' deve ser um número inteiro positivo.",
  }),
  systemsId: z.number().int().positive(),
  owner: z
    .array(OwnerSchema)
    .min(1, { message: "É necessário fornecer pelo menos um proprietário." })
    .max(1, { message: "O número máximo de proprietários permitidos é 1." }),
});

export type TClient = z.infer<typeof ClientSchema>;
