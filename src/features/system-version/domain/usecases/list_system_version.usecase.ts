import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { SystemVersionRepository } from "../services/system_version.repositories";

@Injectable()
export class ListSystemVersionUsecase {
  constructor(private readonly systemVersionService: SystemVersionRepository) {}

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
