import z from "zod";

export const SettingsSchemaDto = z.object({
  clienteSistema: z.boolean(),
  permiteEstoqueManual: z.boolean(),
  utilizaIntegraNovo: z.boolean(),
});

export type TSettingsSchemaDto = z.infer<typeof SettingsSchemaDto>;

export const licensesSchemaDto = z.object({
  contract_id: z.string(),
  system_id: z.number().int().nonnegative(),
  settings: SettingsSchemaDto,
  deleted_at: z.date().optional(),
  monthly_fee: z.number(),
});

export type TLicensesSchemaDto = z.infer<typeof licensesSchemaDto>;
