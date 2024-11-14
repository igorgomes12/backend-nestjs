import { Inject, Injectable } from "@nestjs/common";
import { CalledTypeService } from "../services/called-type.service";
import { CalledEntity } from "../entity/called.entity";

@Injectable()
export class FindCalledByIdUseCase {
  constructor(
    @Inject("CalledTypeService")
    private readonly calledService: CalledTypeService
  ) {}

  async execute(id: number): Promise<CalledEntity | null> {
    if (!id || typeof id !== "number" || id <= 0) {
      throw new Error("ID não pode ser informado");
    }

    const account = await this.calledService.findById(id);
    return account;
  }
}
