import z from "zod";

export const createBodySchemaDto = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  status: z.enum(["ativo", "inativo"]).optional(),
  channel: z.number().optional(),
  profile: z
    .enum([
      "ADMIN",
      "FINANCE",
      "REPRESENTATIVE",
      "REPRESENTATIVE_SUPERVISOR",
      "PROGRAMMING",
      "PROGRAMMING_SUPERVISOR",
      "SUPPORT",
      "SUPPORT_SUPERVISOR",
    ])
    .optional(),
  organization: z.enum(["lider", "Quality"]).optional(),
});

export type TCreateBodySchemaDto = z.infer<typeof createBodySchemaDto>;
