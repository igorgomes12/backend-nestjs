import { z } from "zod";

export const updateUserSchemaDto = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  channel: z.number(),
  status: z.string(),
  organization: z.string(),
  profileId: z.number(),
});
export type TUpdateUserSchemaDto = z.infer<typeof updateUserSchemaDto>;
