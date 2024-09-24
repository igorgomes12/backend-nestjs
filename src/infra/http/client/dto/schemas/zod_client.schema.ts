import { formatCpfOrCnpj } from "@infra/utils/regex/cpf-cnpj";
import { z } from "zod";
import { AccountingSchema, AddressSchema, ContactSchema, OwnerSchema } from ".";

export const ClientSchema = z.object({
  id: z
    .number()
    .int()
    .positive({
      message:
        "O campo 'id' é obrigatório e deve ser um número inteiro positivo.",
    })
    .optional(), // Torne opcional para criação

  identifier: z
    .string()
    .uuid({
      message: "O campo 'identifier' deve ser um UUID válido.",
    })
    .optional(), // Torne opcional para criação

  createdAt: z
    .string()
    .datetime({
      message:
        "O campo 'createdAt' deve ser uma data válida no formato ISO 8601.",
    })
    .optional(), // Torne opcional para criação

  updatedAt: z
    .string()
    .datetime({
      message:
        "O campo 'updatedAt' deve ser uma data válida no formato ISO 8601.",
    })
    .optional(), // Torne opcional para criação

  deletedAt: z.string().datetime().nullable().optional(), // Torne opcional para criação

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

  accounting: z
    .array(AccountingSchema)
    .min(1, {
      message: "É necessário fornecer pelo menos uma informação contábil.",
    })
    .max(1, {
      message: "O número máximo de informações contábeis permitidas é 1.",
    }),

  owner: z
    .array(OwnerSchema)
    .min(1, { message: "É necessário fornecer pelo menos um proprietário." })
    .max(1, { message: "O número máximo de proprietários permitidos é 1." }),
});

export type TClient = z.infer<typeof ClientSchema>;
