import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { User } from "@prisma/client";

import {
  createBodySchemaDto,
  TCreateBodySchemaDto,
} from "features/user/domain/dto/create_body.dto";
import { CreateEntitiy } from "features/user/domain/entity/create.entity";
import { UserEntitiy } from "features/user/domain/entity/user.entity";
import { UserService } from "features/user/domain/services/user.service";

export class UserPrismaService implements UserService {
  constructor(private service: PrismaService) {}
  async findAll(params: TCreateBodySchemaDto): Promise<UserEntitiy[]> {
    const data = await this.service.user.findMany({
      where: {
        name: params.name,
        email: params.email,
        status: params.status,
      },
      select: {
        name: true,
        email: true,
        channel: true,
        status: true,
        profile: true,
      },
    });

    return data.map(
      (user) =>
        new UserEntitiy(user.name, user.email, user.profile.id, user.status)
    );
  }
  findById(user_id: number): Promise<UserEntitiy | null> {
    throw new Error("Method not implemented.");
  }
  async findByEmail(email: string): Promise<UserEntitiy | null> {
    const data = await this.service.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
    if (!data) return null;
    return new UserEntitiy(data.name, data.email, data.profile.id, data.status);
  }
  async create(user: TCreateBodySchemaDto): Promise<CreateEntitiy> {
    try {
      const parsedData = createBodySchemaDto.parse(user);
      console.log("Parsed Data:", parsedData);

      const createdUser = await this.service.user.create({
        data: {
          name: parsedData.name,
          password: parsedData.password,
          email: parsedData.email,
          channel: parsedData.channel || 0,
          profile: {
            connect: { name: parsedData.profile },
          },
          status: parsedData.status,
          organization: parsedData.organization,
        },
      });

      console.log("User created successfully:", createdUser);

      return new CreateEntitiy(
        createdUser.name,
        createdUser.email,
        createdUser.password,
        createdUser.channel,
        createdUser.profileId.toString(),
        createdUser.status,
        createdUser.organization
      );
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
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
