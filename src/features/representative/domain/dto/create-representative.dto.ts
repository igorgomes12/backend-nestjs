import z from "zod";
import { addressRepresentativeSchemaDto } from "./address-representative.dto";
import { commissionRepresentativeSchemaDto } from "./commission-representative.dto";
import { contactRepresentativeSchemaDto } from "./contact-representative.dto";

export const createRepresentativeSchemaDto = z.object({
  name: z.string().min(3, { message: "Favor digitar o nome do representante" }),
  region: z.string().min(1, { message: "Favor digitar o nome da região" }),
  supervisor: z.string().optional(),
  status: z.string(),
  type: z.enum(["REPRESENTATIVE", "CONSULTANT", "PARTHER"]),
  commission: commissionRepresentativeSchemaDto,
  contact: contactRepresentativeSchemaDto,
  address: addressRepresentativeSchemaDto,
  created_at: z.date().optional(),
});

export type CreateRepresentativeSchemaDto = z.infer<
  typeof createRepresentativeSchemaDto
>;
