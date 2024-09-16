import { PrismaClient, User, Prisma } from "@prisma/client";
import { LiderUserRepository } from "../lider_user_repository";

export class PrismaLiderUserRepository extends LiderUserRepository {
  protected prisma = new PrismaClient();

  async create(
    name: string,
    email: string,
    password: string,
    channel: number,
    profile:
      | "admin"
      | "suport"
      | "sellers"
      | "user"
      | "user_basic"
      | "user_intermediate"
      | "user_premium",
    status: "ativo" | "inativo",
    company: "" | "lider" | "Quality"
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
        company,
        profile: {
          connect: { id: profileRecord.id },
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
    return await this.prisma.user.findUnique({
      where: { name },
    });
  }
}
