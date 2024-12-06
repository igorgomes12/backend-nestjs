import { PrismaModule } from "@infra/auth/database/prisma.module";
import { Module } from "@nestjs/common";
import { AgreementeController } from "./agreement.controller";
import { agreementServiceFactory } from "features/agreement/data";
import { FindAllAgreementUseCase } from "features/agreement/domain/usecases/find-all-agreement.usecase";
import { DeleteAgreementUsecase } from "features/agreement/domain/usecases/delete-agreement.usecase";
import { CreateAgreementUseCase } from "features/agreement/domain/usecases/create-agreement.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [AgreementeController],
  providers: [
    agreementServiceFactory,
    FindAllAgreementUseCase,
    DeleteAgreementUsecase,
    CreateAgreementUseCase,
  ],
})
export class AgreementModule {}
