import { Module } from "@nestjs/common";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { EstablishmentController } from "./establishment.controller";
import { EstablishmentServiceFactory } from "features/establishment/data/service";
import { FindAllEstablishmentUseCase } from "features/establishment/domain/usecases/find-all-establishment.usecase";
import { CreateEstablishmentUsecase } from "features/establishment/domain/usecases/create-establishment.usecase";
import { DeleteEstablishmentUsecase } from "features/establishment/domain/usecases/delete-establishment.usecase";
import { UpdateEstablishmentUsecase } from "features/establishment/domain/usecases/update-establishment.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [EstablishmentController],
  providers: [
    EstablishmentServiceFactory,
    FindAllEstablishmentUseCase,
    CreateEstablishmentUsecase,
    UpdateEstablishmentUsecase,
    DeleteEstablishmentUsecase,
  ],
})
export class EstablishmentModule {}
