import { PrismaModule } from "@infra/auth/database/prisma.module";
import { Module } from "@nestjs/common";
import { RepresentativeController } from "./representative.controller";
import { representativeServiceFactory } from "features/representative/data/service";
import { FindAllRepresentativesUseCase } from "features/representative/domain/usecases/find-all.usecase";
import { CreateRepresentativeUseCase } from "features/representative/domain/usecases/create.usecase";
import { DeleteRepresentativeUsecase } from "features/representative/domain/usecases/delete.usecase";
import { UpdateRepresentativeUsecase } from "features/representative/domain/usecases/update.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [RepresentativeController],
  providers: [
    representativeServiceFactory,
    FindAllRepresentativesUseCase,
    CreateRepresentativeUseCase,
    DeleteRepresentativeUsecase,
    UpdateRepresentativeUsecase,
  ],
})
export class RepresentativeModule {}
