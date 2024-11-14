import { Inject, Injectable } from "@nestjs/common";
import { CalledTypeService } from "../services/called-type.service";
import { calledSchema, type CalledDto } from "../dto/called.dto";
import { CalledEntity } from "../entity/called.entity";

@Injectable()
export class CreateCalledUseCase {
  constructor(
    @Inject("CalledTypeService")
    private readonly calledService: CalledTypeService
  ) {}

  async execute(user: CalledDto): Promise<CalledEntity> {
    try {
      // Converte strings de data para objetos Date
      const parsedData = {
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
        timestamp: user.timestamp ? new Date(user.timestamp) : undefined,
        completedAt: user.completedAt ? new Date(user.completedAt) : undefined,
        timestampFinally: user.timestampFinally
          ? new Date(user.timestampFinally)
          : undefined,
      };

      // Validar os dados após a conversão
      const validatedData = calledSchema.parse(parsedData);

      // Verificar a duplicidade
      const { name } = validatedData;
      const existingCalled = await this.calledService.findByName(name);
      if (existingCalled) {
        throw new Error("Já existe um chamado com esse nome");
      }

      // Criar novo chamado
      const result = await this.calledService.create(validatedData);
      return result;
    } catch (error) {
      throw new Error("Falha ao criar conta: " + error);
    }
  }
}
