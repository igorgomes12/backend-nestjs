import { Injectable, NotFoundException } from "@nestjs/common";
import {
  systemSchemaDto,
  TSystemSchemaDto,
} from "../../../../infra/http/systems/dto/system.dto";
import { SystemsService } from "../../service/service_system/systems.service";

@Injectable()
export class UpdateSystemUsecase {
  constructor(private readonly systemsService: SystemsService) {}

  async execute(id: string, data: TSystemSchemaDto) {
    const existingSystem = await this.systemsService.findOne(id);
    if (!existingSystem) {
      throw new NotFoundException(
        "Sistema não encontrado para o ID fornecido."
      );
    }

    const { name, description, image_url, stable_version } =
      systemSchemaDto.parse(data);
    if (!name) {
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

    const existStableVersion =
      await this.systemsService.findByVersion(stable_version);

    if (stable_version.length === 0 || undefined) {
      throw new NotFoundException(
        "Não foi possível criar um novo sistema, favor digitar uma versão estável válida."
      );
    } else if (existStableVersion) {
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
        image_url,
        stable_version,
      });
    } catch (error) {
      throw new Error("Erro ao tentar atualizar o sistema");
    }
  }
}
