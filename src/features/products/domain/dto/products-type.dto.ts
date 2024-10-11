import z from "zod";

export const productsSchemaDto = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  price: z.number().positive(),
  qtd_stock: z.number().int().positive(),
  qtd_consigned: z.number(),
});

export type TProductSchemaDto = z.infer<typeof productsSchemaDto>;
