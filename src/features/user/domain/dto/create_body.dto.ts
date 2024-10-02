import z from "zod";

export const CreateBodySchemaDto = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  channel: z.number(),
  profile: z.string(),
  status: z.string(),
  organization: z.string(),
});

export type TCreateBodySchemaDto = z.infer<typeof CreateBodySchemaDto>;
