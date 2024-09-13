import { z } from "zod";

export const CreateUserBodySchemaDto = z.object({
  name: z
    .string()
    .min(1, { message: "O nome do usuário é obrigatório" })
    .min(5, { message: "O nome do usuário deve ter pelo menos 5 caracteres" })
    .max(100, {
      message: "O nome do usuário deve ter no máximo 100 caracteres",
    }),

  email: z
    .string()
    .email({ message: "O e-mail do usuário deve ser válido" })
    .min(1, { message: "O e-mail do usuário é obrigatório" }),

  password: z
    .string()
    .min(1, { message: "A senha do usuário é obrigatória" })
    .min(5, { message: "A senha do usuário deve ter pelo menos 5 caracteres" })
    .max(100, {
      message: "A senha do usuário deve ter no máximo 100 caracteres",
    }),

  channel: z.number().optional(),

  profile: z.enum(["administrador", "suporte", "vendedor", "usuario"], {
    message: "O perfil do usuário é obrigatório e deve ser um dos valores permitidos",
  }),

  status: z.enum(["ativo", "inativo"]).default("ativo"),

  company: z.enum(["lider", "Quality"]).optional(),
});

export type TCreateUserBodyFormDto = z.infer<typeof CreateUserBodySchemaDto>;