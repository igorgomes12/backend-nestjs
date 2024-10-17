import { formatPhone, phoneRegex } from "@common/utils/regex/phone";
import { z } from "zod";

export const representativeSchemaDto = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(3, { message: "Favor digitar o nome do representante" }),
  cellphone: z
    .string()
    .transform(formatPhone)
    .refine((phone) => phoneRegex.test(phone), {
      message:
        "Favor digitar o número do celular no formato correto (XX) XXXXX-XXXX",
    }),
  phone: z
    .string()
    .transform(formatPhone)
    .refine((phone) => phoneRegex.test(phone), {
      message:
        "Favor digitar o número do telefone no formato correto (XX) XXXX-XXXX",
    }),
  type: z.enum(["REPRESENTATIVE", "CONSULTANT", "PARTHER"]),
  region: z.string().min(1, { message: "Favor digitar o nome da região" }),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
  deleted_by: z.string().nullable().optional(),
});

export type TRepresentativeSchemaDto = z.infer<typeof representativeSchemaDto>;
