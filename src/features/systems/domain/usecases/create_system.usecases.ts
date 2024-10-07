import { Injectable, NotFoundException } from "@nestjs/common";
import { SystemPrismaRepository } from "features/systems/data/service/prisma/systems-prisma.service";
import {
  TSystemSchemaDto,
  systemSchemaDto,
} from "features/systems/domain/dto/system.dto";

@Injectable()
export class CreateSystemUsecase {
  constructor(private readonly systemsService: SystemPrismaRepository) {}

  async execute(data: TSystemSchemaDto) {
    const { name, description, image_url, stable_version } =
      systemSchemaDto.parse(data);

    if (!name || name.trim().length === 0) {
      throw new NotFoundException(
        "Não foi possível criar um novo sistema, favor digitar um nome válido."
      );
    }
    if (!image_url) {
      throw new NotFoundException(
        "Não foi possível criar um novo sistema, favor digitar uma URL válida para a imagem."
      );
    }
    if (!description || description.length === 0) {
      throw new NotFoundException(
        "Não foi possível criar um novo sistema, favor digitar uma descrição válida."
      );
    }
    const existingName = await this.systemsService.findByName(name);
    if (existingName) {
      throw new NotFoundException("Já existe um sistema com esse nome.");
    }

    try {
      return await this.systemsService.create({
        name,
        description,
        image_url,
        stable_version,
      });
    } catch (error) {
      throw new NotFoundException("Erro ao tentar criar sistema");
    }
  }
}
