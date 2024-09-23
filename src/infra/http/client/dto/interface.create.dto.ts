import type { TClient } from "./schemas/zod_client.schema";

export namespace ClientCreateService {
  export type TInput = {
    data: TClient;
  };

  export type TOutput = {
    message: string;
    client: TClient;
  };
}
