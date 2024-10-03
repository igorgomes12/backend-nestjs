import { z } from "zod";

export const deleteUserSchemaDto = z.object({
  id: z.number().nonnegative(),
});

export type TDeleteUserSchemaDto = z.infer<typeof deleteUserSchemaDto>;
