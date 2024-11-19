import z from "zod";

// Defina o enum como no Prisma

export const dadosGeraisSchema = z.object({
  id: z.number().optional(),
  caller: z.string().min(1, {
    message: "O solicitante deve ser fornecido e não pode estar vazio.",
  }),
  contact: z.string().email(),
  createdAt: z.string().min(1, {
    message: "A data de criação deve ser fornecida e não pode estar vazia.",
  }),
  name: z.string().optional(),
  timestamp: z.string().min(1, {
    message: "A data e hora final é opcional e pode ser nula.",
  }),
});

export type TDadosGeraisSchema = z.infer<typeof dadosGeraisSchema>;
