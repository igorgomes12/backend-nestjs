import { NotFoundException } from "@nestjs/common";
import { SystemVersionService } from "../system_version.service";

export class DeleteSystemVersionUsecase {
  constructor(private readonly systemVersionService: SystemVersionService) {}

  async execute(id: number) {
    if (!id) {
      throw new NotFoundException("ID não fornecido.");
    }
    const systemDelete = await this.systemVersionService.findOne(id);
    if (!systemDelete) {
      throw new NotFoundException("Sistema não encontrado.");
    }
    try {
      return await this.systemVersionService.remove(id);
    } catch (error) {
      throw new NotFoundException("Erro ao tentar remover sistema.");
    }
  }
}
