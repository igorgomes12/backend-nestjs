import { Injectable, NotFoundException } from "@nestjs/common";
import { SystemsService } from "../systems.service";

@Injectable()
export class FindAllSystemsUseCase {
  constructor(private readonly systemsService: SystemsService) {}

  async execute() {
    const systems = await this.systemsService.findAll();
    if (systems.length === 0) {
      throw new NotFoundException("Nenhum sistema encontrado!");
    }

    return systems;
  }
}
