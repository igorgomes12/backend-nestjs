import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Module } from "@nestjs/common";
import { EstablishmentController } from "./establishment.controller";
import { EstablishmentService } from "@common/domain/service/service_establishment/establishment.service";

@Module({
  imports: [PrismaModule],
  controllers: [EstablishmentController],
  providers: [EstablishmentService, PrismaService],
})
export class EstablishmentModule {}
