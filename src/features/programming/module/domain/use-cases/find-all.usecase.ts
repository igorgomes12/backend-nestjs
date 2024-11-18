import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ModuleServiceTypes } from "../services/module.service";
import { CreateModuleEntity } from "../entity/create.entity";

@Injectable()
export class FindAllModulesUseCase {
  constructor(
    @Inject("ModuleServiceTypes")
    public service: ModuleServiceTypes
  ) {}

  async execute(): Promise<CreateModuleEntity[]> {
    try {
      const modules = await this.service.findAll();
      if (modules.length === 0) {
        throw new Error("Não há módulos cadastrados!");
      }
      return modules;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erro ao buscar todos os módulos!"
      );
    }
  }
}
