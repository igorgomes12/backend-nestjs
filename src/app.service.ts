import { Injectable } from "@nestjs/common";
import { PrismaService } from "./database/prisma.service";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { name: string; email: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }
}
