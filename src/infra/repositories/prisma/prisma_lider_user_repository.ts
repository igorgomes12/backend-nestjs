import { PrismaClient, User } from "@prisma/client";
import { LiderUserRepository } from "../lider_user_repository";

export class PrismaLiderUserRepository extends LiderUserRepository {
  protected prisma = new PrismaClient();

  async create(
    name: string,
    email: string,
    password: string,
    channel: number,
    profile: "administrador" | "suporte" | "vendedor" | "usuario",
    status: "ativo" | "inativo",
    company: "" | "lider" | "Quality",
  ): Promise<void> {
    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        channel,
        profile,
        status,
        company,
      },
    });
  }
  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
  async delete(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async update(userId: number, updateData: Partial<User>): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { name: name },
    });
  }
}
