import z from "zod";

export const commissionRepresentativeSchemaDto = z.object({
  implantation: z.number(),
  mensality: z.number(),
});

export type CommissionRepresentativeDto = z.infer<
  typeof commissionRepresentativeSchemaDto
>;
