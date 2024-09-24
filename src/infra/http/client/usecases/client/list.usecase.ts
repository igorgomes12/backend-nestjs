import type { TClientProps } from "../../entities/client.entity";
import type { ClientGateway } from "../../gateway/client.gateway";
import type { UseCase } from "./usecase";

export type ListClientInputDto = void;

export type ListClientOutputDto = {
  clients: TClientProps[];
};

export class ListClientUseCase
  implements UseCase<ListClientInputDto, ListClientOutputDto>
{
  private constructor(private readonly clientGateway: ClientGateway) {}

  public static create(clientGateway: ClientGateway) {
    return new ListClientUseCase(clientGateway);
  }

  public async execute(): Promise<ListClientOutputDto> {
    const clients = await this.clientGateway.list();
    const formattedClients = clients.map((client) => client.toJSON());
    return { clients: formattedClients };
  }
}
