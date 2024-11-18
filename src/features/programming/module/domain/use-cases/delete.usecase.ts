import { Inject, Injectable } from "@nestjs/common";
import type { ModuleServiceTypes } from "../services/module.service";

@Injectable()
export class DeleteModuleUsecase {
  constructor(
    @Inject("ModuleServiceTypes") public service: ModuleServiceTypes
  ) {}
  async execute(id: number): Promise<void> {
    const existingModule = await this.service.findById(id);
    if (!existingModule) {
      throw new Error("Módulo não encontrado!");
    }
    try {
      await this.service.delete(id);
    } catch (error) {
      throw new Error("Erro ao deletar módulo!");
    }
  }
}
