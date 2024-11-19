import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CalledTypeService } from "../services/called-type.service";
import { CalledEntity } from "../entity/called.entity";

@Injectable()
export class FindAllCalledUseCase {
  constructor(
    @Inject("CalledTypeService")
    private readonly calledService: CalledTypeService
  ) {}
  async execute(): Promise<CalledEntity[]> {
    try {
      const calledFind = await this.calledService.findAll();
      if (calledFind.length > 0) {
        return calledFind;
      } else {
        throw new InternalServerErrorException(
          "Não foi possível encontrar os dados"
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
