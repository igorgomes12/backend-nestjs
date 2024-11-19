import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CalledTypeService } from "../services/called-type.service";
import { CalledEntity } from "../entity/called.entity";

@Injectable()
export class UpdateCalledUseCase {
  constructor(
    @Inject("CalledTypeService")
    private readonly calledService: CalledTypeService
  ) {}

  async execute(
    id: number,
    user: Partial<CalledEntity>
  ): Promise<CalledEntity> {
    if (!id) {
      throw new BadRequestException("ID não pode ser informado");
    }

    const existingAccount = await this.calledService.findById(id);
    if (!existingAccount) {
      throw new Error("chamado não encontrada");
    }

    const updatedAccount = {
      ...existingAccount,
      ...user,
      updatedAt: new Date(),
    };

    return this.calledService.update(id, updatedAccount);
  }
}
