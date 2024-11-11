import { z } from "zod";

export const accountSchema = z.object({
  id: z.number().nonnegative().int().optional(),
  value: z
    .string()
    .min(1, "O saldo atual é obrigatório.")
    .regex(
      /^R\$\s?\d{1,3}(\.\d{3})*,\d{2}$/,
      "Insira um valor válido no formato R$ 1.234,56 para o saldo."
    ),
  description: z
    .string()
    .min(1, "A descrição é obrigatória.")
    .max(100, "A descrição não pode ter mais que 100 caracteres."),
  observation: z
    .string()
    .max(200, "As observações não podem ter mais que 200 caracteres.")
    .optional(),
  status: z.boolean(),
  bank: z.boolean(),
});

export type TAccounts = z.infer<typeof accountSchema>;
