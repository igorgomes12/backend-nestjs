import z from "zod";

export const systemSchemaDto = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, { message: "Favor digitar o nome do sistema" }),
});

export type TSystemSchemaDto = z.infer<typeof systemSchemaDto>;
