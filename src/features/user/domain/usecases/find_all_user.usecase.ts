import { BadRequestException, Injectable } from "@nestjs/common";
import { TCreateBodySchemaDto } from "../dto/create_body.dto";
import { UserEntitiy } from "../entity/user.entity";
import { UserService } from "../services/user.service";

@Injectable()
export class FindAllUserUseCase {
  constructor(private readonly service: UserService) {}

  async execute(query: TCreateBodySchemaDto): Promise<UserEntitiy[]> {
    try {
      const data = await this.service.findAll({
        name: query.name,
        email: query.email,
        status: query.status,
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
