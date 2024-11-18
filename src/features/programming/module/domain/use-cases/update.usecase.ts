import { Inject, Injectable } from "@nestjs/common";
import type { ModuleServiceTypes } from "../services/module.service";
import { ModuleSchemaDto, type TModuleSchemaDto } from "../dto/module.dto";
import type { CreateModuleEntity } from "../entity/create.entity";

@Injectable()
export class UpdateModuleUsecase {
  constructor(
    @Inject("ModuleServiceTypes") public service: ModuleServiceTypes
  ) {}

  async execute(module: TModuleSchemaDto): Promise<CreateModuleEntity> {
    const value = ModuleSchemaDto.parse(module);
    const { id, module: moduleName, system } = value;
    const existingModule = await this.service.findName(moduleName);
    if (existingModule && existingModule.id !== id) {
      throw new Error("O módulo já existe!");
    }
    if (!system) {
      throw new Error("O sistema é obrigatório!");
    }
    try {
      return await this.service.update(value);
    } catch (error) {
      throw new Error("Erro ao atualizar módulo!");
    }
  }
}
