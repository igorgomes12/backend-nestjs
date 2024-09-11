import { PrismaClient, User } from "@prisma/client";
import { LiderUserRepository } from "../lider_user_repository";

export class PrismaLiderUserRepository extends LiderUserRepository {
  private prisma = new PrismaClient();

  async create(
    name_user: string,
    email_login_user: string,
    password_user: string,
    channel_user: number,
    profile_user: "administrador" | "suporte" | "vendedor" | "usuario",
    status_user: "ativo" | "inativo",
    company_user: "" | "lider" | "Quality",
  ): Promise<void> {
    await this.prisma.user.create({
      data: {
        name_user,
        email_login_user,
        password_user,
        channel_user,
        profile_user,
        status_user,
        company_user,
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
      where: { email_login_user: email },
    });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { name_user: name },
    });
  }
}
