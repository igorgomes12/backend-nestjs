import { formatCNPJ } from "@infra/utils/regex/cpnj";
import { formatPhone } from "@infra/utils/regex/phone";
import z from "zod";

export const AccountingSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Favor digitar o nome com no minimo de 2 caracteres" })
    .nonempty({ message: "Nome é obrigatório" }),
  phone: z
    .string()
    .nonempty({ message: "Telefone é obrigatório" })
    .transform((val) => formatPhone(val)),
  email: z
    .string()
    .email({ message: "Favor digitar um e-mail válido" })
    .nonempty({ message: "E-mail é obrigatório" }),
  contact: z.string().nonempty({ message: "Contato é obrigatório" }),
  crc: z.string().nonempty({ message: "CRC é obrigatório" }),
  cnpj: z
    .string()
    .nonempty({ message: "CNPJ é obrigatório" })
    .transform((val) => formatCNPJ(val)),
});

export type TAccountingSchema = z.infer<typeof AccountingSchema>;
