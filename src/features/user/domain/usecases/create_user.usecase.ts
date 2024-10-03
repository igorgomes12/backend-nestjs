import { Injectable } from "@nestjs/common";
import {
  createBodySchemaDto,
  type TCreateBodySchemaDto,
} from "../dto/create_body.dto";
import { UserService } from "../services/user.service";

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly service: UserService) {}

  async execute(data: TCreateBodySchemaDto) {
    const validationResult = createBodySchemaDto.safeParse(data);

    if (!validationResult.success) {
      throw new Error(validationResult.error.message);
    }

    return this.service.create(validationResult.data);
  }
}
