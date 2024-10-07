import { Module } from "@nestjs/common";
import { LincesesController } from "./linceses.controller";
import { LincesesService } from "features/licenses/data/service/prisma/licenses-prisma.service";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { licenseServiceFactory } from "features/licenses/data/service";
import { FindAllLicensesUseCase } from "features/licenses/domain/usecases/find-all.usecase";
import { CreateLicenseUsecase } from "features/licenses/domain/usecases/create.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [LincesesController],
  providers: [
    LincesesService,
    licenseServiceFactory,
    FindAllLicensesUseCase,
    CreateLicenseUsecase,
  ],
})
export class LincesesModule {}
