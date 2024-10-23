import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { CreateRepresentativeSchemaDto } from "../dto/create-representative.dto";
import { CreateRepresentativeEntity } from "../entity/create-representative.entity";
import { RepresentativeServiceTypes } from "../services/representative.repositories";

@Injectable()
export class CreateRepresentativeUseCase {
  private readonly logger = new Logger(CreateRepresentativeUseCase.name);

  constructor(private readonly service: RepresentativeServiceTypes) {}

  async execute(
    data: CreateRepresentativeSchemaDto
  ): Promise<CreateRepresentativeEntity> {
    this.validateInput(data);

    const existingRepresentative = await this.service.findByName(data.name);

    if (existingRepresentative) {
      throw new BadRequestException("Representante já existe");
    }

    try {
      const newRepresentative = {
        ...data,
        created_at: new Date(),
      };

      return await this.service.create(newRepresentative);
    } catch (error) {
      if (error instanceof Error)
        this.logger.error("Erro ao criar representante", error.stack);
      throw new InternalServerErrorException("Erro ao criar representante");
    }
  }

  private validateInput(data: CreateRepresentativeSchemaDto): void {
    const requiredFields = [
      { field: "name", message: "Nome inválido" },
      { field: "region", message: "Região inválida" },
      { field: "status", message: "Status inválido" },
      { field: "type", message: "Tipo inválido" },
      { field: "commission", message: "Comissão inválida" },
      { field: "contact", message: "Contato inválido" },
      { field: "address", message: "Endereço inválido" },
    ];

    for (const { field, message } of requiredFields) {
      if (!data[field]) {
        throw new BadRequestException(message);
      }
    }

    if (!data.contact.cellphone || !data.contact.phone) {
      throw new BadRequestException("Dados de contato inválidos");
    }

    if (!data.address.street || !data.address.postal_code) {
      throw new BadRequestException("Dados de endereço inválidos");
    }
  }
}
