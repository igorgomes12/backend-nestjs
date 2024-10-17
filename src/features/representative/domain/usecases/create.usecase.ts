import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { RepresentativeServiceTypes } from "../services/representative.repositories";
import { CreateRepresentativeSchemaDto } from "../dto/create-representative.dto";
import { CreateRepresentativeEntity } from "../entity/create-representative.entity";

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
      { field: "supervisor", message: "Supervisor inválido" },
      { field: "status", message: "Status inválido" },
      { field: "type", message: "Tipo inválido" },
      { field: "commission", message: "Comissão inválida" },
      { field: "contact", message: "Contato inválido" },
      { field: "address", message: "Endereço inválido" },
    ];

    for (const { field, message } of requiredFields) {
      if (
        !data[field] ||
        (typeof data[field] === "string" && data[field].length < 1)
      ) {
        throw new BadRequestException(message);
      }
    }
  }
}
