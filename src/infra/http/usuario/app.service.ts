import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateUserBodySchemaDto, TCreateUserBodyFormDto } from "./dtos/create_user_body_dto";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: unknown) {
    // Validação dos dados de entrada usando Zod
    const parsedData = CreateUserBodySchemaDto.parse(data);

    try {
      return await this.prisma.user.create({
        data: {
          name: parsedData.name,
          password: parsedData.password,
          email: parsedData.email,
          channel: parsedData.channel || 0,
          profile: {
            connect: { name: parsedData.profile }, // Conecta usando o nome do perfil
          },
          status: parsedData.status,
          company: parsedData.company || "",
          permissions: {}, // Inicialize conforme necessário
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("O e-mail já está em uso.");
      }
      throw error;
    }
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }
}