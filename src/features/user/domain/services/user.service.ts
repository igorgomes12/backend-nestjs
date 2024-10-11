import { TCreateBodySchemaDto } from "../dto/create_body.dto";
import { UpdateserEntity } from "../entity/update.entity";
import { UserEntity } from "../entity/user.entity";

export abstract class UserService {
  abstract findAll(params: TCreateBodySchemaDto): Promise<UserEntity[]>;
  abstract findById(user_id: number): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(user: TCreateBodySchemaDto): Promise<void>;
  abstract update(
    user_id: number,
    user: Partial<UpdateserEntity>
  ): Promise<UpdateserEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findByName(name: string): Promise<UpdateserEntity | null>;
}
