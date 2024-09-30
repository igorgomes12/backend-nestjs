import { z } from "zod";

export const SystemVersionSchemaDto = z.object({
  id: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.length > 0, {
      message: "O ID deve ser um número inteiro positivo",
    }),
  system_id: z.string(),
  version: z.string().regex(/^\d+(\.\d+)*$/, {
    message:
      "A versão estável deve estar no formato x, x.y ou x.y.z, com um ou mais dígitos em cada seção",
  }),
  description: z.string().optional(),
  release_date: z.date().optional(),
});

export type TSystemVersionSchemaDto = z.infer<typeof SystemVersionSchemaDto>;
