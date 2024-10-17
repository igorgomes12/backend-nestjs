import {
  BadRequestException,
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { RepresentativeServiceTypes } from "../services/representative.repositories";

@Injectable()
export class DeleteRepresentativeUsecase {
  private readonly logger = new Logger(DeleteRepresentativeUsecase.name);

  constructor(private readonly service: RepresentativeServiceTypes) {}

  async execute(id: number): Promise<void> {
    try {
      const representative = await this.service.findById(id);
      if (!representative) {
        this.logger.warn(
          `Tentativa de excluir representante não encontrado: ID ${id}`
        );
        throw new BadRequestException("Representante não encontrado");
      }

      await this.service.remove(id);

      this.logger.log(`Representante ID ${id} removido com sucesso`);
    } catch (error) {
      if (error instanceof Error)
        this.logger.error(
          `Erro ao remover representante ID ${id}`,
          error.stack
        );
      throw new InternalServerErrorException("Erro ao remover representante");
    }
  }
}
