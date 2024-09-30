import { Injectable, NotFoundException } from "@nestjs/common";
import { SystemsService } from "../../service/service_system/systems.service";

@Injectable()
export class DeleteSystemUsecase {
  constructor(private readonly systemsService: SystemsService) {}

  async execute(id: string) {
    if (!id) {
      throw new NotFoundException("ID não fornecido.");
    }

    const systemDelete = await this.systemsService.findOne(id);
    if (!systemDelete) {
      throw new NotFoundException("Sistema não encontrado.");
    }

    try {
      return await this.systemsService.remove(id);
    } catch (error) {
      throw new NotFoundException("Erro ao tentar remover sistema.");
    }
  }
}
