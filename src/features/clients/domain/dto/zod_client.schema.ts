import { formatCpfOrCnpj } from "@common/utils/regex/cpf-cnpj";
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

  createdAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  updatedAt: z
    .string()
    .datetime({
      message:
        "O campo 'updatedAt' deve ser uma data válida no formato ISO 8601.",
    })
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  deletedAt: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  corporate_name: z.string().nonempty("Corporate name is required"),

  fantasy_name: z.string().optional(),

  contacts: z
    .array(ContactSchema)
    .min(1, { message: "É necessário fornecer pelo menos um contato." })
    .max(5, { message: "O número máximo de contatos permitidos é 5." })
    .optional(),

  cpf_cnpj: z
    .string()
    .min(11, {
      message: "O campo 'cpf_cnpj' deve ter no mínimo 11 caracteres.",
    })
    .max(18, {
      message: "O campo 'cpf_cnpj' deve ter no máximo 18 caracteres.",
    })
    .transform((val) => formatCpfOrCnpj(val)),

  state_registration: z.string().optional(),
  municipal_registration: z.string().optional(),
  rural_registration: z.string().optional(),

  addresses: z
    .array(AddressSchema)
    .min(1, { message: "É necessário fornecer pelo menos um endereço." })
    .max(10, { message: "O número máximo de endereços permitidos é 10." })
    .optional(),

  name_account: z.string().optional(),
  id_account: z
    .number()
    .int()
    .positive({
      message: "O campo 'id_account' deve ser um número inteiro positivo.",
    })
    .optional(),

  establishment_typeId: z.number().optional(),
  systemsId: z.number().int().positive().optional(),
  owner: OwnerSchema.optional(),
  representativeId: z.number().optional(),
});

export type TClient = z.infer<typeof ClientSchema>;
