import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { User } from "@prisma/client";
import { TCreateBodySchemaDto } from "features/user/domain/dto/create_body.dto";
import { UserEntitiy } from "features/user/domain/entity/user.entity";
import { UserService } from "features/user/domain/services/user.service";

export class UserPrismaService implements UserService {
  constructor(private service: PrismaService) {}
  async findAll(params: TCreateBodySchemaDto): Promise<UserEntitiy[]> {
    const data = await this.service.user.findMany({
      where: {
        OR: [
          { name: { contains: params.name } },
          { email: { contains: params.email } },
        ],
        organization: params.organization,
      },
      select: {
        id: true,
        name: true,
        email: true,
        channel: true,
        status: true,
        organization: true,
        profile: true,
        password: false,
      },
    });
    return data.map(
      (item) =>
        new UserEntitiy(
          item.name,
          item.email,
          "",
          item.channel,
          item.status,
          item.organization,
          item.profile.name
        )
    );
  }
  findById(user_id: number): Promise<UserEntitiy | null> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<UserEntitiy | null> {
    throw new Error("Method not implemented.");
  }
  create(user: TCreateBodySchemaDto): Promise<UserEntitiy> {
    throw new Error("Method not implemented.");
  }
  update(user_id: number, user: User): Promise<UserEntitiy> {
    throw new Error("Method not implemented.");
  }
  delete(user_id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findByName(name: string): Promise<UserEntitiy | null> {
    throw new Error("Method not implemented.");
  }
}
