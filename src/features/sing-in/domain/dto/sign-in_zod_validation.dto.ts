import { z } from "zod";

export const signInZodValidationDto = z.object({
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .min(5, { message: "O e-mail deve ter no mínimo 5 caracteres" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
});

export type TSingInValidationDto = z.infer<typeof signInZodValidationDto>;
