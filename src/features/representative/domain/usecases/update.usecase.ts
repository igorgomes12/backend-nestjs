import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { RepresentativeServiceTypes } from "../services/representative.repositories";
import { RepresentativeEntity } from "../entity/representative.entity";

@Injectable()
export class UpdateRepresentativeUsecase {
  private readonly logger = new Logger(UpdateRepresentativeUsecase.name);

  constructor(private readonly service: RepresentativeServiceTypes) {}

  async execute(
    id: number,
    data: Partial<RepresentativeEntity>
  ): Promise<RepresentativeEntity> {
    const existingRepresentative = await this.service.findById(id);
    if (!existingRepresentative) {
      this.logger.warn(`Representante com ID ${id} não encontrado.`);
      throw new NotFoundException("Representante não encontrado");
    }

    const updateData: RepresentativeEntity = {
      ...existingRepresentative,
      ...data,
    };

    try {
      const updatedRepresentative = await this.service.update(id, updateData);
      this.logger.log(`Representante com ID ${id} atualizado com sucesso.`);
      return updatedRepresentative;
    } catch (error) {
      if (error instanceof Error)
        this.logger.error(
          `Erro ao atualizar representante com ID ${id}`,
          error.stack
        );
      throw new InternalServerErrorException("Erro ao atualizar representante");
    }
  }
}
