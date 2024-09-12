import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { TCreateUserBodyFormDto } from "./dtos/create_user_body_dto";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: TCreateUserBodyFormDto) {
    try {
      return await this.prisma.user.create({
        data: {
          name: data.name || "",
          password: data.password || "",
          email: data.email || "",
          channel: data.channel || 0,
          profile: data.profile || 0,
          status: data.status || "",
          company: data.company || "",
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
