import z from "zod";
import { contactRepresentativeSchemaDto } from "./contact-representative.dto";
import { addressRepresentativeSchemaDto } from "./address-representative.dto";
import { commissionRepresentativeSchemaDto } from "./commission-representative.dto";

export const createRepresentativeSchemaDto = z.object({
  name: z.string().min(3, { message: "Favor digitar o nome do representante" }),
  region: z.string().min(1, { message: "Favor digitar o nome da região" }),
  supervisor: z.string(),
  status: z.enum(["ativo", "inativo"]).default("ativo"),
  type: z.enum(["REPRESENTATIVE", "CONSULTANT", "PARTHER"]),
  commission: commissionRepresentativeSchemaDto,
  contact: contactRepresentativeSchemaDto,
  address: addressRepresentativeSchemaDto,
  created_at: z.date().optional(),
});

export type CreateRepresentativeSchemaDto = z.infer<
  typeof createRepresentativeSchemaDto
>;
