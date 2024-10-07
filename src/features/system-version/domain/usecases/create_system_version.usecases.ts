import { Injectable, NotFoundException } from "@nestjs/common";
import { SystemVersionPrismaRepositories } from "features/system-version/data/service/prisma/system-version.service";

import { TSystemVersionSchemaDto } from "features/system-version/domain/dto/system_version.dtos";

@Injectable()
export class CreateSystemVersionUseCase {
  constructor(
    private readonly systemVersionService: SystemVersionPrismaRepositories
  ) {}

  async execute(data: Omit<TSystemVersionSchemaDto, "id" | "release_date">) {
    const { description, system_id, version } = data;

    if (!description || description.trim().length === 0) {
      throw new NotFoundException("Descrição não foi informada.");
    }
    if (!system_id) {
      throw new NotFoundException("Id do sistema não foi informado.");
    }
    if (!version || version.trim().length === 0) {
      throw new NotFoundException("Versão não foi informada.");
    }

    const existingSystem =
      await this.systemVersionService.findByVersion(version);
    if (existingSystem) {
      throw new NotFoundException("Versão do sistema já cadastrada.");
    }

    try {
      return await this.systemVersionService.create({
        description,
        system_id,
        version,
      });
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
