import {
  Inject,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { AccoutingServiceMethods } from "../services/accouting.service";

export class DeleteAccountUsecase {
  private readonly logger = new Logger(DeleteAccountUsecase.name);

  constructor(
    @Inject("AccoutingServiceMethods")
    private readonly service: AccoutingServiceMethods
  ) {}

  async execute(id: number): Promise<string> {
    if (!this.isValidId(id)) {
      this.logger.warn(`Tentativa de deletar conta com ID inválido: ${id}`);
      throw new BadRequestException("ID inválido fornecido");
    }

    try {
      const account = await this.service.findById(id);
      if (!account) {
        this.logger.warn(`Conta com ID ${id} não encontrada`);
        throw new NotFoundException("Conta não encontrada");
      }

      await this.service.delete(id);
      this.logger.log(`Conta com ID ${id} deletada com sucesso`);
      return `Conta com ID ${id} deletada com sucesso`;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao deletar conta com ID ${id}: ${error.message}`,
          error.stack
        );
      } else {
        this.logger.error(`Erro desconhecido ao deletar conta com ID ${id}`);
      }
      throw error;
    }
  }

  private isValidId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
  }
}
