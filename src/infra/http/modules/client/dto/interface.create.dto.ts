import type { TClient } from "@common/domain/entities/entities_client/zod_client.schema";

export namespace ClientCreateService {
  export type TInput = {
    data: TClient;
  };

  export type TOutput = {
    message: string;
    client: TClient;
  };
}
