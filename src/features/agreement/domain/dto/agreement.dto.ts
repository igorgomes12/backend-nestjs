import { z } from "zod";

// Define enums usando Zod
const TypeSituationAgreement = z.enum([
  "ACORDADO",
  "NAO_ACORDADO",
  "FINALIZADO",
]);
const TypeSituationPaymentAgreement = z.enum([
  "RECEBER_DO_CLIENTE",
  "REBECER_AQUI",
  "DEPOSITO",
  "BOLETO",
]);

export const AgreementDTOSchema = z.object({
  id: z.number().int(),
  timestamp: z.string().datetime(),
  representativeId: z.number().int(),
  description: z.string(),
  value: z.string(),
  clientId: z.number().int(),
  paymment: z.string().datetime(),
  paymentId: z.string(),
  observation: z.string().optional(),
  situation: TypeSituationAgreement,
  situatonpayment: TypeSituationPaymentAgreement,
});

export type AgreementDTO = z.infer<typeof AgreementDTOSchema>;
