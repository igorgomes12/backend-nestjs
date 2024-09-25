import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Module, ValidationPipe } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { APP_PIPE } from "@nestjs/core";

@Module({
  controllers: [ClientController],
  providers: [
    ClientService,
    PrismaService,
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
