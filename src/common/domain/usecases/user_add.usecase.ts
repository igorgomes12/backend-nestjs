
import { ServerError } from "@common/errors/server.error";
import { LiderUserRepository } from "@infra/repositories/lider_user_repository";
import { ConflictException } from "@nestjs/common";
import { hash } from "bcryptjs";

export namespace UserAddUseCase {
  export type TInput = {
    name: string;
    email: string;
    password: string;
    channel: number;
    profile:
      | "admin"
      | "suport"
      | "sellers"
      | "user"
      | "user_basic"
      | "user_intermediate"
      | "user_premium";
    status: "ativo" | "inativo";
    organization: "lider" | "Quality";
  };

  export type TOutput = {
    id: number;
    name: string;
    email: string;
    channel: number;
    status: string;
    organization: string;
    profileId: string;
  };

  export class UseCase {
    constructor(private userRepository: LiderUserRepository) {}

    async execute(user: TInput): Promise<TOutput> {
      const { email, name, password, channel, profile, status, organization } =
        user;

      // Validações básicas
      if (!email || !password || !name) {
        throw new ServerError("Os dados de entrada não estão sendo enviados");
      }

      // Verificar se o email já existe
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ConflictException("Email já cadastrado!");
      }

      // Criar usuário
      const hashedPassword = await hash(password, 8);
      await this.userRepository.create(
        name,
        email,
        hashedPassword,
        channel,
        profile,
        status,
        organization
      );

      // Supondo que a função create retorna o ID do usuário criado
      const newUser = await this.userRepository.findByEmail(email);
      if (!newUser) {
        throw new Error("Erro ao criar usuário");
      }

      // Retornar dados do usuário criado
      return {
        id: newUser.id,
        name,
        email,
        channel,
        status,
        organization,
        profileId: profile,
      };
    }
  }
}
