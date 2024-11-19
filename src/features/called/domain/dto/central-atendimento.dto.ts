import z from "zod";

export const centralAtendimentoSchema = z.object({
  description: z.string().min(1, {
    message: "A descrição deve ser fornecida e não pode estar vazia.",
  }),
  module: z.string(),
  system: z
    .string()
    .optional()
    .nullable()
    .describe("O sistema é opcional e pode ser nulo."),
  type: z.enum(["BUG", "ASSISTANCE"]),
});

export type TCentralAtendimentoSchema = z.infer<
  typeof centralAtendimentoSchema
>;
