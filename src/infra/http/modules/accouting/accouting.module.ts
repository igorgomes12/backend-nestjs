import { Module } from "@nestjs/common";
import { AccoutingController } from "./accouting.controller";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { AccoutingService } from "@common/domain/service/service_accouting/accouting.service";
import { ListFindAllUseCase } from "features/accouting/domain/usecases/list-findAll.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [AccoutingController],
  providers: [AccoutingService, PrismaService, ListFindAllUseCase],
})
export class AccoutingModule {}
