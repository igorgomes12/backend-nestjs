import { PrismaClient, User } from "@prisma/client";
import { LiderUserRepository } from "../lider_user_repository";


export class PrismaLiderUserRepository extends LiderUserRepository {
  protected prisma = new PrismaClient();

  async create(
    name: string,
    email: string,
    password: string,
    channel: number,
    profile:
      "ADMIN"|
      "FINANCE"|
      "REPRESENTATIVE"|
      "REPRESENTATIVE_SUPERVISOR"|
      "PROGRAMMING"|
      "PROGRAMMING_SUPERVISOR"|
      "SUPPORT"|
      "SUPPORT_SUPERVISOR",
    status: "ativo" | "inativo",
    organization: "" | "lider" | "Quality"
  ): Promise<void> {
    let profileRecord = await this.prisma.profile.findUnique({
      where: { name: profile },
    });

    if (!profileRecord) {
      profileRecord = await this.prisma.profile.create({
        data: { name: profile },
      });
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        channel,
        status,
        organization,
        profile: {
          connect: { id: profileRecord.id },
        },
      },
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        channel: true,
        status: true,
        organization: true,
        profile: {
          select: {    
            id: true,    
            name: true,
          },
        },
        password: false,  // Não retorna o campo password
      },
    });
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async update(userId: number, updateData: Partial<User>): Promise<User> {
    const { profileId, id, ...otherData } = updateData; // Remova `id` do objeto `data`

    if (profileId) {
      // Verifique se o perfil existe antes de tentar conectar
      const profileExists = await this.prisma.profile.findUnique({
        where: { id: profileId },
      });

      if (!profileExists) {
        throw new Error("Perfil não encontrado");
      }

      return this.prisma.user.update({
        where: { id: userId },
        data: {
          ...otherData,
          profile: {
            connect: { id: profileId },
          },
        },
      });
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: otherData,
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { name },
    });
  }
}
