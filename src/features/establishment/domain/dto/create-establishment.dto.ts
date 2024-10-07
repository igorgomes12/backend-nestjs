import { z } from "zod";

export const schemaEstablished = z.object({
  name: z.string().min(1, { message: "Favor digitar um nome válido" }),
  status: z.boolean(),
});
export type TSchemaEstablished = z.infer<typeof schemaEstablished>;
