import type { TClient } from "../../dto/schemas/zod_client.schema";
import type { ClientGateway } from "../../gateway/client.gateway";
import type { UseCase } from "./usecase";
import { Client } from "../../entities/client.entity";

export type TCreateClientInputDto = {
  client: TClient;
};

export type TCreateClientOutputDto = {
  message: string;
  client: TClient;
};

export class CreateClientUsecase
  implements UseCase<TCreateClientInputDto, TCreateClientOutputDto>
{
  private constructor(private readonly clientGateway: ClientGateway) {}

  public static create(clientGateway: ClientGateway) {
    return new CreateClientUsecase(clientGateway);
  }

  public async execute({
    client,
  }: TCreateClientInputDto): Promise<TCreateClientOutputDto> {
    try {
      const clientEntity = Client.create(client);

      await this.clientGateway.save(clientEntity);

      const output: TCreateClientOutputDto = {
        message: "Cliente criado com sucesso",
        client: clientEntity,
      };
      return output;
    } catch (error) {
      throw new Error("Erro ao salvar o cliente");
    }
  }
}
