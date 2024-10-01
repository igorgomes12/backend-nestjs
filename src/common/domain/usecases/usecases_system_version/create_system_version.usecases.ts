import { Injectable, NotFoundException } from "@nestjs/common";
import { TSystemVersionSchemaDto } from "@infra/http/system_version/dto/system_version.dtos";
import { SystemVersionService } from "@common/domain/service/service_system_version/system_version.service";

@Injectable()
export class CreateSystemVersionUseCase {
  constructor(private readonly systemVersionService: SystemVersionService) {}

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
