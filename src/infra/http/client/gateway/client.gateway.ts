import type { Client } from "../entities/client.entity";

export interface ClientGateway {
  list(): Promise<Client[]>;
  save(client: Client): Promise<void>;
  update(client: Client): Promise<void>;
  delete(clientId: string): Promise<void>;
}
