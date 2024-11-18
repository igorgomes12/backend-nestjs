import { z } from "zod";

const moduleSystemTypes = z.enum([
  "FRENTE",
  "RETAGUARDA",
  "LIDERPDV",
  "LIDERODONTO",
  "WEBLIDER",
  "OUTROS",
]);

export const ModuleSchemaDto = z.object({
  id: z
    .number()
    .int()
    .positive({ message: "O ID do módulo é obrigatório" })
    .optional(),

  system: moduleSystemTypes,

  module: z
    .string()
    .min(1, { message: "O nome do módulo é obrigatório" })
    .min(5, { message: "O nome do módulo deve ter pelo menos 5 caracteres" })
    .max(100, {
      message: "O nome do módulo deve ter no máximo 100 caracteres",
    }),

  status: z.boolean().default(true),
});

export type TModuleSchemaDto = z.infer<typeof ModuleSchemaDto>;
