import { SystemVersionService } from "@common/domain/service/service_system_version/system_version.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class ListSystemVersionUsecase {
  constructor(private readonly systemVersionService: SystemVersionService) {}

  async execute() {
    try {
      const systems = await this.systemVersionService.findAll();
      return systems;
    } catch (error) {
      console.error("Erro ao listar versões do sistema:", error);
      throw new InternalServerErrorException(
        "Erro ao listar versões do sistema."
      );
    }
  }
}
