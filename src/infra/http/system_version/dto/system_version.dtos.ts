import { z } from "zod";

export const SystemVersionSchemaDto = z.object({
  id: z
    .number()
    .int()
    .optional()
    .refine((val) => val === undefined || val > 0, {
      message: "O ID deve ser um número inteiro positivo",
    }),
  system_id: z.number().int(),
});

export type TSystemVersionSchemaDto = z.infer<typeof SystemVersionSchemaDto>;
