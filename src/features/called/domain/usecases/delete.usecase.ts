import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { CalledTypeService } from "../services/called-type.service";

@Injectable()
export class DeleteCalledUsecase {
  constructor(
    @Inject("CalledTypeService")
    private readonly calledService: CalledTypeService
  ) {}
  async execute(id: number) {
    if (!id) {
      throw new NotFoundException("ID não fornecido.");
    }
    const calledDelete = await this.calledService.findById(id);
    if (!calledDelete) {
      throw new NotFoundException("CustomerVersion não encontrado.");
    }
    await this.calledService.delete(id);
    return { message: "CustomerVersion excluído com sucesso." };
  }
}
