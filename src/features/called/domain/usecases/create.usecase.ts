import { CalledTypeService } from "../services/called-type.service";
import { calledSchema, type CalledDto } from "../dto/called.dto";
import { CalledEntity } from "../entity/called.entity";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class CreateCalledUseCase {
  constructor(
    @Inject("CalledTypeService")
    private readonly calledService: CalledTypeService
  ) {}

  async execute(user: CalledDto): Promise<CalledEntity> {
    try {
      const validatedData = calledSchema.parse(user);
      const result = await this.calledService.create(validatedData);
      return result;
    } catch (error) {
      throw new Error("Falha ao criar conta: " + error);
    }
  }
}
