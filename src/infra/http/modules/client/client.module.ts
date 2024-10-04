import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Module, ValidationPipe } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { APP_PIPE } from "@nestjs/core";
import { clientServiceFactory } from "features/clients/data/service";
import { FindAllClientUseCase } from "features/clients/domain/usecases/find-all-client.usecase";
import { CreateClientUseCase } from "features/clients/domain/usecases/create-client.usecase";

@Module({
  controllers: [ClientController],
  providers: [
    PrismaService,
    FindAllClientUseCase,
    CreateClientUseCase,
    clientServiceFactory,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class ClientModule {}
