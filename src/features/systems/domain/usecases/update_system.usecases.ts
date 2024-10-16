import { Injectable, NotFoundException } from "@nestjs/common";
import { SystemPrismaRepository } from "features/systems/data/service/prisma/systems-prisma.service";
import {
  type TSystemSchemaDto,
  systemSchemaDto,
} from "features/systems/domain/dto/system.dto";

@Injectable()
export class UpdateSystemUsecase {
  constructor(private readonly systemsService: SystemPrismaRepository) {}

  async execute(id: number, data: TSystemSchemaDto) {
    const existingSystem = await this.systemsService.findOne(id);
    if (!existingSystem) {
      throw new NotFoundException(
        "Sistema não encontrado para o ID fornecido."
      );
    }

    const { name, description, image, stable_version } =
      systemSchemaDto.parse(data);
    if (!name) {
      throw new NotFoundException(
        "Não foi possível atualizar o sistema, favor digitar um nome válido."
      );
    }
    if (!description || description.length === 0) {
      throw new NotFoundException(
        "Não foi possível atualizar o sistema, favor digitar uma descrição válida."
      );
    }

    const existStableVersion =
      await this.systemsService.findByVersion(stable_version);

    if (stable_version && stable_version.length === 0) {
      throw new NotFoundException(
        "Não foi possível atualizar o sistema, favor digitar uma versão estável válida."
      );
    } else if (existStableVersion && existStableVersion.id !== id) {
      throw new NotFoundException(
        "Já existe um sistema com essa versão estável."
      );
    }

    const existingName = await this.systemsService.findByName(name);
    if (existingName && existingName.id !== id) {
      throw new Error("Já existe um sistema com esse nome.");
    }

    try {
      return await this.systemsService.update(id, {
        name,
        description,
        image,
        stable_version,
      });
    } catch (error) {
      throw new Error("Erro ao tentar atualizar o sistema");
    }
  }
}
