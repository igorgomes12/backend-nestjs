import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "../../auth/database/prisma/prisma.service";
import {
  CreateUserBodySchemaDto,
  type TCreateUserBodyFormDto,
} from "./dtos/create_user_body_dto";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: TCreateUserBodyFormDto) {
    const parsedData = CreateUserBodySchemaDto.parse(data);
    try {
      return await this.prisma.user.create({
        data: {
          name: parsedData.name,
          password: parsedData.password,
          email: parsedData.email,
          channel: parsedData.channel || 0,
          profile: {
            connect: { name: parsedData.profile },
          },
          status: parsedData.status,
          organization: parsedData.organization || "",
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("O e-mail já está em uso.");
      }
      throw new InternalServerErrorException("Erro ao criar usuário.");
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      include: {
        profile: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
