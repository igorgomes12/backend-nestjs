import { SystemVersionService } from "@common/domain/service/service_system_version/system_version.service";
import { TSystemVersionSchemaDto } from "@infra/http/system_version/dto/system_version.dtos";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class UpdateSystemVersionUsecase {
  constructor(private readonly systemVersionService: SystemVersionService) {}

  async execute(id: number, data: TSystemVersionSchemaDto) {
    if (!id) {
      throw new NotFoundException("ID não fornecido.");
    }

    if (!data.version) {
      throw new BadRequestException("Versão não fornecida.");
    }

    const existingSystemVersion = await this.systemVersionService.findOne(id);
    if (!existingSystemVersion) {
      throw new NotFoundException("Versão do sistema não encontrada.");
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new BadRequestException("Descrição não fornecida ou inválida.");
    }

    if (!data.release_date) {
      throw new BadRequestException("Data de lançamento não fornecida.");
    }

    if (!data.system_id) {
      throw new BadRequestException("ID do sistema não fornecido.");
    }

    try {
      return await this.systemVersionService.update(id, data);
    } catch (error) {
      console.error("Erro ao tentar atualizar a versão do sistema:", error);
      throw new BadRequestException(
        "Erro ao tentar atualizar a versão do sistema."
      );
    }
  }
}
