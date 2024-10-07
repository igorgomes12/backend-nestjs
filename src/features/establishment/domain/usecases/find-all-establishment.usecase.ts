import { BadRequestException, Injectable } from "@nestjs/common";
import { TSchemaEstablished } from "../dto/create-establishment.dto";
import { EstablishmentEntity } from "../entity/establishment.entity";
import { EstablishmentTypeService } from "../services/establishment-type.sevice";

@Injectable()
export class FindAllEstablishmentUseCase {
  constructor(private readonly service: EstablishmentTypeService) {}

  async execute(params: TSchemaEstablished): Promise<EstablishmentEntity[]> {
    try {
      const data = await this.service.findAll({
        name: params.name,
        status: params.status,
      });
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}
