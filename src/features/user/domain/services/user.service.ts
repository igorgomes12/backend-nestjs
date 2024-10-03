import { User } from "@prisma/client";
import { TCreateBodySchemaDto } from "../dto/create_body.dto";
import { CreateEntitiy } from "../entity/create.entity";
import { DeleteUserEntity } from "../entity/delete.entity";
import { UserEntitiy } from "../entity/user.entity";

export abstract class UserService {
  abstract findAll(params: TCreateBodySchemaDto): Promise<UserEntitiy[]>;
  abstract findById(user_id: number): Promise<DeleteUserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntitiy | null>;
  abstract create(user: TCreateBodySchemaDto): Promise<CreateEntitiy>;
  abstract update(user_id: number, user: User): Promise<UserEntitiy>;
  abstract delete(user_id: number): Promise<void>;
  abstract findByName(name: string): Promise<UserEntitiy | null>;
}
