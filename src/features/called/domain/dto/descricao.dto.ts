import z from "zod";

export const descricaoSchema = z.object({
  note: z
    .string()
    .optional()
    .nullable()
    .describe("A observação é opcional e pode ser nula."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  requested: z.string().min(1, {
    message:
      "A informação solicitada deve ser fornecida e não pode estar vazia.",
  }),
  response: z
    .string()
    .optional()
    .nullable()
    .describe("A resposta é opcional e pode ser nula."),
  solutionType: z.enum(["PHONE", "IN_PERSON", "REMOTE"]),
});

export type TDescricaoSchema = z.infer<typeof descricaoSchema>;
