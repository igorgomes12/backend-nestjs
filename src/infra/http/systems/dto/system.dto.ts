import z from "zod";

export const systemSchemaDto = z.object({
  id: z
    .number()
    .int()
    .optional()
    .refine((val) => val === undefined || val > 0, {
      message: "O ID deve ser um número inteiro positivo",
    }),
  name: z.string().min(1, { message: "Favor digitar o nome do sistema" }),
  description: z.string().optional(),
  imagem_url: z
    .string()
    .url({ message: "Favor fornecer uma URL válida para a imagem" }),
  stable_version: z
    .string()
    .regex(/^\d+(\.\d+)*$/, {
      message:
        "A versão estável deve estar no formato x, x.y ou x.y.z, com um ou mais dígitos em cada seção",
    })
    .optional(),
});

export type TSystemSchemaDto = z.infer<typeof systemSchemaDto>;
