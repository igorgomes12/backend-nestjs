// import { z } from "zod";

// export const ClientSchema = z.object({
//   createdAt: z.date().default(new Date()), // Valor padrão é a data atual
//   corporate: z.string()
//     .max(100, "O nome corporativo deve ter no máximo 100 caracteres.")
//     .min(1, "O nome corporativo é obrigatório."),
//   fantasy: z.string()
//     .max(100, "O nome fantasia deve ter no máximo 100 caracteres.")
//     .min(1, "O nome fantasia é obrigatório."),
//   phone: z.string()
//     .max(14, "O telefone deve ter no máximo 14 caracteres.")
//     .min(1, "O telefone é obrigatório."),
//   representative: z.string()
//     .max(50, "O representante deve ter no máximo 50 caracteres.")
//     .min(1, "O representante é obrigatório."),
//   unit: z.string()
//     .min(1, "A unidade é obrigatória."),
//   system: z.string()
//     .min(1, "O sistema é obrigatório."),
//   establishmentType: z.string()
//     .min(1, "O tipo de estabelecimento é obrigatório."),
//   cpf_cnpj: z.string()
//     .max(20, "O CPF/CNPJ deve ter no máximo 20 caracteres.")
//     .nullable()
//     .optional(),
//   stateRegistration: z.string()
//     .max(20, "A inscrição estadual deve ter no máximo 20 caracteres.")
//     .min(1, "A inscrição estadual é obrigatória."),
//   municipalRegistration: z.string()
//     .max(20, "A inscrição municipal deve ter no máximo 20 caracteres.")
//     .nullable()
//     .optional(),
//   ruralRegistration: z.string()
//     .max(20, "A inscrição rural deve ter no máximo 20 caracteres.")
//     .nullable()
//     .optional(),
//   notes: z.string()
//     .nullable()
//     .optional(),
//   status: z.string()
//     .min(1, "O status é obrigatório."),
//   companyId: z.number()
//     .int("O ID da empresa deve ser um número inteiro.")
//     .positive("O ID da empresa deve ser positivo.")
//     .default(1),
//   representativeId: z.number()
//     .int("O ID do representante deve ser um número inteiro.")
//     .positive("O ID do representante deve ser positivo.")
//     .nullable()
//     .optional(),
//   ownerId: z.number()
//     .int("O ID do proprietário deve ser um número inteiro.")
//     .positive("O ID do proprietário deve ser positivo.")
//     .nullable()
//     .optional(),
//   addressId: z.number()
//     .int("O ID do endereço deve ser um número inteiro.")
//     .positive("O ID do endereço deve ser positivo.")
//     .nullable()
//     .optional(),
//   contactId: z.number()
//     .int("O ID do contato deve ser um número inteiro.")
//     .positive("O ID do contato deve ser positivo.")
//     .nullable()
//     .optional(),
//   contabilityId: z.number()
//     .int("O ID da contabilidade deve ser um número inteiro.")
//     .positive("O ID da contabilidade deve ser positivo.")
//     .nullable()
//     .optional(),
//   organizationId: z.number()
//     .int("O ID da organização deve ser um número inteiro.")
//     .positive("O ID da organização deve ser positivo."),
// });

// export type TClientFormData = z.infer<typeof ClientSchema>;