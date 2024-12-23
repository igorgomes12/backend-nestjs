import z from "zod";

export const systemSchemaDto = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, { message: "Favor digitar o nome do sistema" }),
  description: z.string().optional(),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
  stable_version: z
    .string()
    .regex(/^\d+(\.\d+)*$/, {
      message:
        "A versão estável deve estar no formato x, x.y ou x.y.z, com um ou mais dígitos em cada seção",
    })
    .optional(),
});

export type TSystemSchemaDto = z.infer<typeof systemSchemaDto>;
