import { Module } from "@nestjs/common";
import { EstablishmentService } from "./establishment.service";
import { EstablishmentController } from "./establishment.controller";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";

@Module({
  imports: [PrismaModule],
  controllers: [EstablishmentController],
  providers: [EstablishmentService, PrismaService],
})
export class EstablishmentModule {}
