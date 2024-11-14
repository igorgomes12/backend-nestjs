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
      priority: user.priority,
      caller: user.caller,
      name: user.name,
      description: user.description,
      status: user.status,
      type: user.type,
      contact: user.contact,
      system: user.system,
      module: user.module,
      requested: user.requested,
      note: user.note,
      response: user.response,
      solutionType: user.solutionType,
      duration: user.duration,
      completedAt: user.completedAt,
      timestampFinally: user.timestampFinally,
      createdAt: user.createdAt,
      timestamp: user.timestamp,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };

    return this.calledService.update(id, updatedAccount);
  }
}
