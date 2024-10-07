import { Injectable, NotFoundException } from "@nestjs/common";
import { SystemPrismaRepository } from "features/systems/data/service/prisma/systems-prisma.service";

@Injectable()
export class FindAllSystemsUseCase {
  constructor(private readonly systemsService: SystemPrismaRepository) {}

  async execute() {
    const systems = await this.systemsService.findAll();
    if (systems.length === 0) {
      throw new NotFoundException("Nenhum sistema encontrado!");
    }

    return systems;
  }
}
