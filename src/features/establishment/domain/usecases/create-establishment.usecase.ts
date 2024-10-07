import { BadRequestException, Injectable } from "@nestjs/common";
import { EstablishmentTypeService } from "../services/establishment-type.sevice";
import {
  schemaEstablished,
  TSchemaEstablished,
} from "../dto/create-establishment.dto";
import { EstablishmentEntity } from "../entity/establishment.entity";

@Injectable()
export class CreateEstablishmentUsecase {
  constructor(private readonly service: EstablishmentTypeService) {}

  async execute(data: TSchemaEstablished): Promise<EstablishmentEntity> {
    const { name, status } = schemaEstablished.parse(data);

    if (!status) {
      throw new BadRequestException("Status inválido");
    }
    if (!name || name.length < 1) {
      throw new BadRequestException("Nome inválido");
    }

    const existingEstablishment = await this.service.findByName(name);
    if (existingEstablishment) {
      throw new BadRequestException("Nome já cadastrado");
    }

    return this.service.create({ name, status });
  }
}
