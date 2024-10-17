import z from "zod";

export const addressRepresentativeSchemaDto = z.object({
  postal_code: z.string().min(1, { message: "Favor digitar o CEP" }),
  street: z.string().min(1, { message: "Favor digitar o nome da rua" }),
  number: z.string(),
  neighborhood: z
    .string()
    .min(1, { message: "Favor digitar o nome do bairro" }),
  municipality_name: z
    .string()
    .min(1, { message: "Favor digitar o nome do estado" }),
  state: z.string(),
});

export type AddressRepresentativeSchemaDto = z.infer<
  typeof addressRepresentativeSchemaDto
>;
