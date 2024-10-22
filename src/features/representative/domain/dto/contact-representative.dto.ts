import z from "zod";

export const contactRepresentativeSchemaDto = z.object({
  cellphone: z.string(),
  phone: z.string(),
  email: z.string(),
  description: z.string().optional(),
  favorite: z.boolean().optional(),
});
export type ContactRepresentativeDto = z.infer<
  typeof contactRepresentativeSchemaDto
>;
