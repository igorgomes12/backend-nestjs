import { z } from "zod";

const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"], {
  errorMap: () => ({
    message: "A prioridade deve ser uma das seguintes: LOW, MEDIUM, HIGH.",
  }),
});
const typeCalledEnum = z.enum(["BUG", "ASSISTANCE"], {
  errorMap: () => ({
    message: "O tipo deve ser um dos seguintes: BUG, ASSISTANCE.",
  }),
});
const typeContactEnum = z.enum(["PHONE", "EMAIL", "WHATSAPP", "MOBILE"], {
  errorMap: () => ({
    message:
      "O contato deve ser um dos seguintes: PHONE, EMAIL, WHATSAPP, MOBILE.",
  }),
});
const typeSolutionsEnum = z.enum(["PHONE", "IN_PERSON", "REMOTE"], {
  errorMap: () => ({
    message:
      "O tipo de solução deve ser um dos seguintes: PHONE, IN_PERSON, REMOTE.",
  }),
});

export const calledSchema = z.object({
  id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("ID deve ser um número inteiro positivo."),
  priority: priorityEnum,
  caller: z.string().min(1, {
    message: "O solicitante deve ser fornecido e não pode estar vazio.",
  }),
  name: z
    .string()
    .min(1, { message: "O nome deve ser fornecido e não pode estar vazio." }),
  description: z.string().min(1, {
    message: "A descrição deve ser fornecida e não pode estar vazia.",
  }),
  status: z.boolean().describe("O status deve ser verdadeiro ou falso."),
  type: typeCalledEnum,
  contact: typeContactEnum,
  module: z.string(),
  system: z
    .string()
    .optional()
    .nullable()
    .describe("O sistema é opcional e pode ser nulo."),
  requested: z.string().min(1, {
    message:
      "A informação solicitada deve ser fornecida e não pode estar vazia.",
  }),
  note: z
    .string()
    .optional()
    .nullable()
    .describe("A observação é opcional e pode ser nula."),
  response: z
    .string()
    .optional()
    .nullable()
    .describe("A resposta é opcional e pode ser nula."),
  solutionType: typeSolutionsEnum,
  duration: z
    .date()
    .optional()
    .nullable()
    .describe("A duração é opcional e pode ser nula."),
  completedAt: z
    .date()
    .optional()
    .nullable()
    .describe("A data de conclusão é opcional e pode ser nula."),
  timestampFinally: z
    .date()
    .optional()
    .nullable()
    .describe("A data e hora final é opcional e pode ser nula."),
  createdAt: z
    .date()
    .optional()
    .nullable()
    .describe("A data de criação é opcional e padrão para agora."),
  timestamp: z
    .date()
    .optional()
    .nullable()
    .describe("O timestamp é opcional e pode ser nulo."),
  updatedAt: z
    .date()
    .optional()
    .nullable()
    .describe("A data de atualização é opcional e pode ser nula."),
  deletedAt: z
    .date()
    .optional()
    .nullable()
    .describe("A data de exclusão é opcional e pode ser nula."),
});

export type CalledDto = z.infer<typeof calledSchema>;
