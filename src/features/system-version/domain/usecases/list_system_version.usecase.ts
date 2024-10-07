import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { SystemVersionPrismaRepositories } from "features/system-version/data/service/prisma/system-version.service";

@Injectable()
export class ListSystemVersionUsecase {
  constructor(
    private readonly systemVersionService: SystemVersionPrismaRepositories
  ) {}

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
