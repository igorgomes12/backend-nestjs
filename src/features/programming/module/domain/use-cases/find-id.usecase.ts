import { Inject, Injectable } from "@nestjs/common";
import { ModuleServiceTypes } from "../services/module.service";
import { CreateModuleEntity } from "../entity/create.entity";

@Injectable()
export class FindModuleByIdUseCase {
  constructor(
    @Inject("ModuleServiceTypes") public service: ModuleServiceTypes
  ) {}
  async execute(id: number): Promise<CreateModuleEntity> {
    const existingModule = await this.service.findById(id);
    if (!existingModule) {
      throw new Error("Módulo não encontrado!");
    }
    return existingModule;
  }
}
