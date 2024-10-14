import { Injectable, NotFoundException } from "@nestjs/common";
import { SystemPrismaRepository } from "features/systems/data/service/prisma/systems-prisma.service";
import { systemSchemaDto } from "features/systems/domain/dto/system.dto";

@Injectable()
export class CreateSystemUsecase {
  constructor(private readonly systemsService: SystemPrismaRepository) {}

  async execute(data: any) {
    const validatedData = systemSchemaDto.parse(data);

    if (!validatedData.name || validatedData.name.trim().length === 0) {
      throw new NotFoundException(
        "Não foi possível criar um novo sistema, favor digitar um nome válido."
      );
    }
    if (!validatedData.description || validatedData.description.length === 0) {
      throw new NotFoundException(
        "Não foi possível criar um novo sistema, favor digitar uma descrição válida."
      );
    }
    const existingName = await this.systemsService.findByName(
      validatedData.name
    );
    if (existingName) {
      throw new NotFoundException("Já existe um sistema com esse nome.");
    }

    try {
      return await this.systemsService.create(validatedData);
    } catch (error) {
      throw new NotFoundException("Erro ao tentar criar sistema");
    }
  }
}
