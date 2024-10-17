import { formatPhone, phoneRegex } from "@common/utils/regex/phone";
import z from "zod";

export const contactRepresentativeSchemaDto = z.object({
  cellphone: z.string(),
  // .transform(formatPhone)
  // .refine((phone) => phoneRegex.test(phone), {
  //   message:
  //     "Favor digitar o número do celular no formato correto (XX) XXXXX-XXXX",
  // }),
  phone: z.string(),
  // .transform(formatPhone)
  // .refine((phone) => phoneRegex.test(phone), {
  //   message:
  //     "Favor digitar o número do telefone no formato correto (XX) XXXX-XXXX",
  // }),
  email: z.string(),
});
export type ContactRepresentativeDto = z.infer<
  typeof contactRepresentativeSchemaDto
>;
