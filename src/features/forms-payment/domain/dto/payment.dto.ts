import { z } from "zod";

export const TSchemaPaymentDto = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(3, { message: "Necessário colocar um nome válido" }),
});

export type TSchemaPayamentDtoForm = z.infer<typeof TSchemaPaymentDto>;
