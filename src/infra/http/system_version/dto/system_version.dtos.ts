import { z } from "zod";

export const SystemVersionSchemaDto = z.object({
  system_id: z.number().positive().optional(),
  version: z.string().regex(/^\d+(\.\d+)*$/, {
    message:
      "A versão estável deve estar no formato x, x.y ou x.y.z, com um ou mais dígitos em cada seção",
  }),
  description: z.string().optional(),
  release_date: z.date().optional(),
});

export type TSystemVersionSchemaDto = z.infer<typeof SystemVersionSchemaDto>;

export type TPostValid = {
  version: string;
  description: string;
};
