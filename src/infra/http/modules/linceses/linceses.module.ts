import { Module } from "@nestjs/common";
import { LicensesController } from "./linceses.controller";
import { LicensesService } from "features/licenses/data/service/prisma/licenses-prisma.service";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { licenseServiceFactory } from "features/licenses/data/service";
import { FindAllLicensesUseCase } from "features/licenses/domain/usecases/find-all.usecase";
import { CreateLicenseUsecase } from "features/licenses/domain/usecases/create.usecase";
import { UpdateLicenseUsecase } from "features/licenses/domain/usecases/update.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [LicensesController],
  providers: [
    LicensesService,
    licenseServiceFactory,
    FindAllLicensesUseCase,
    CreateLicenseUsecase,
    UpdateLicenseUsecase,
  ],
})
export class LincesesModule {}
