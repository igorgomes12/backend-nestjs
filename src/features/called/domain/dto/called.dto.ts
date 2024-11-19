import { z } from "zod";
import { dadosGeraisSchema } from "./dados-gerais.dto";
import { centralAtendimentoSchema } from "./central-atendimento.dto";
import { descricaoSchema } from "./descricao.dto";

export const calledSchema = z.object({
  id: z.number().optional(),
  dadosGerais: dadosGeraisSchema,
  centralAtendimento: centralAtendimentoSchema,
  descricao: descricaoSchema,
});

export type CalledDto = z.infer<typeof calledSchema>;
