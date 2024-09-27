import { Injectable, NotFoundException } from "@nestjs/common";
import { systemSchemaDto, TSystemSchemaDto } from "../dto/system.dto";
import { SystemsService } from "../systems.service";

@Injectable()
export class UpdateSystemUsecase {
  constructor(private readonly systemsService: SystemsService) {}

  async execute(id: number, data: TSystemSchemaDto) {
    const existingSystem = await this.systemsService.findOne(id);
    if (!existingSystem) {
      throw new NotFoundException(
        "Sistema não encontrado para o ID fornecido."
      );
    }

    const { name } = systemSchemaDto.parse(data);
    if (!name) {
      throw new NotFoundException(
        "Não foi possível criar um novo sistema, favor digitar um nome válido."
      );
    }

    // Verifique se já existe outro sistema com o mesmo nome
    const existingName = await this.systemsService.findByName(name);
    if (existingName && existingName.id !== id) {
      throw new Error("Já existe um sistema com esse nome.");
    }

    try {
      return await this.systemsService.update(id, { name });
    } catch (error) {
      throw new Error("Erro ao tentar atualizar o sistema");
    }
  }
}
