import { Injectable, NotFoundException } from "@nestjs/common";
import { systemSchemaDto, TSystemSchemaDto } from "../dto/system.dto";
import { SystemsService } from "../systems.service";

@Injectable()
export class CreateSystemUsecase {
  constructor(private readonly systemsService: SystemsService) {}

  async execute(data: TSystemSchemaDto) {
    const { name } = systemSchemaDto.parse(data);

    if (!name || name.trim().length === 0) {
      throw new NotFoundException(
        "Não foi possível criar um novo sistema, favor digitar um nome válido."
      );
    }

    const existingName = await this.systemsService.findByName(name);
    if (existingName) {
      throw new NotFoundException("Já existe um sistema com esse nome.");
    }

    try {
      return await this.systemsService.create({ name });
    } catch (error) {
      throw new NotFoundException("Erro ao tentar criar sistema");
    }
  }
}
