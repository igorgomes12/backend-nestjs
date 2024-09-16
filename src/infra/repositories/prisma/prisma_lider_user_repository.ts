import { PrismaClient, User } from "@prisma/client";
import { LiderUserRepository } from "../lider_user_repository";

export class PrismaLiderUserRepository extends LiderUserRepository {
  protected prisma = new PrismaClient();

  async create(
    name: string,
    email: string,
    password: string,
    channel: number,
    profile: "admin"| "suport"| "sellers"| "user"| "user_basic"| "user_intermediate"| "user_premium",
    status: "ativo" | "inativo",
    company: "" | "lider" | "Quality",
  ): Promise<void> {
    // Primeiro, verifique se o perfil existe
    const profileRecord = await this.prisma.profile.findUnique({
      where: { name: profile },
    });
  
    // Se o perfil não existir, crie-o
    if (!profileRecord) {
      await this.prisma.profile.create({
        data: { name: profile },
      });
    }
  
    // Agora, crie o usuário conectando ao perfil
    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        channel,
        status,
        company,
        permissions: {}, // ou qualquer valor JSON válido que você precise
        profile: {
          connect: { name: profile },
        },
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

  async update(userId: number, updateData: Partial<Omit<User, 'id'>>): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateData as any, // ou ajuste conforme necessário para corresponder aos tipos esperados
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
