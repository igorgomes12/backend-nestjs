import { z } from "zod";

export const updateUserSchemaDto = z.object({
  id: z.number().nonnegative().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  status: z.enum(["ativo", "inativo"]).optional(),
});
export type TUpdateUserSchemaDto = z.infer<typeof updateUserSchemaDto>;
