import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { LicensesService } from "features/licenses/data/service/prisma/licenses-prisma.service";
import { TLicensesSchemaDto } from "../dto/licenses.dto";
import { LicenseEntity } from "../entity/lincese.entity";

@Injectable()
export class UpdateLicenseUsecase {
  private readonly logger = new Logger(UpdateLicenseUsecase.name);

  constructor(
    @Inject(LicensesService)
    private readonly licensesService: LicensesService
  ) {}

  async execute(
    id: number,
    data: Partial<TLicensesSchemaDto>
  ): Promise<LicenseEntity> {
    try {
      const existingLicense = await this.licensesService.findById(id);
      if (!existingLicense) {
        this.logger.warn(`Licença com ID ${id} não encontrada`);
        throw new NotFoundException(`Licença com ID ${id} não encontrada`);
      }

      if (!this.isValidData(data)) {
        this.logger.warn(
          `Dados inválidos para atualização da licença com ID ${id}`
        );
        throw new BadRequestException("Dados inválidos para atualização");
      }

      const updatedLicense = await this.licensesService.update(id, data);
      this.logger.log(`Licença com ID ${id} atualizada com sucesso`);
      return updatedLicense;
    } catch (error) {
      if (error instanceof Error)
        this.logger.error(
          `Erro ao atualizar licença com ID ${id}: ${error.message}`
        );
      throw new InternalServerErrorException(
        "Erro ao processar a atualização da licença"
      );
    }
  }

  private isValidData(data: Partial<TLicensesSchemaDto>): boolean {
    // Implementar lógica de validação específica, se necessário
    return true; // Retornar verdadeiro se os dados forem válidos
  }
}
