import { PrismaModule } from "@infra/auth/database/prisma.module";
import { Module } from "@nestjs/common";
import { ModulesController } from "./modules.controller";
import { FindAllModulesUseCase } from "features/programming/module/domain/use-cases/find-all.usecase";
import { CreateModuleUseCase } from "features/programming/module/domain/use-cases/create.usecase";
import { DeleteModuleUsecase } from "features/programming/module/domain/use-cases/delete.usecase";
import { UpdateModuleUsecase } from "features/programming/module/domain/use-cases/update.usecase";
import { FindModuleByIdUseCase } from "features/programming/module/domain/use-cases/find-id.usecase";
import { moduleServiceFactory } from "features/programming/module/data/service";

@Module({
  imports: [PrismaModule],
  controllers: [ModulesController],
  providers: [
    moduleServiceFactory,
    FindAllModulesUseCase,
    CreateModuleUseCase,
    DeleteModuleUsecase,
    UpdateModuleUsecase,
    FindModuleByIdUseCase,
  ],
})
export class ModulesModule {}
