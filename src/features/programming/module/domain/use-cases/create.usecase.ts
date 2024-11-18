import { Inject, Injectable } from "@nestjs/common";
import type { ModuleServiceTypes } from "../services/module.service";
import { ModuleSchemaDto, type TModuleSchemaDto } from "../dto/module.dto";
import type { CreateModuleEntity } from "../entity/create.entity";

@Injectable()
export class CreateModuleUseCase {
  constructor(
    @Inject("ModuleServiceTypes") public service: ModuleServiceTypes
  ) {}

  async execute(module: TModuleSchemaDto): Promise<CreateModuleEntity> {
    const value = ModuleSchemaDto.parse(module);
    const { module: moduleName, system } = value;
    const existingModule = await this.service.findName(moduleName);
    if (existingModule) {
      throw new Error("O módulo já existe!");
    }
    if (!system) {
      throw new Error("O sistema é obrigatório!");
    }
    try {
      return await this.service.create(value);
    } catch (error) {
      throw new Error("Erro ao criar módulo!");
    }
  }
}
