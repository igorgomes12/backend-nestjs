import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Module } from "@nestjs/common";
import { SystemVersionController } from "./system_version.controller";

import { SystemVersionServiceFactory } from "features/system-version/data/service";
import { CreateSystemVersionUseCase } from "features/system-version/domain/usecases/create_system_version.usecases";
import { DeleteSystemVersionUsecase } from "features/system-version/domain/usecases/delete_system_version.usecases";
import { ListSystemVersionUsecase } from "features/system-version/domain/usecases/list_system_version.usecase";
import { UpdateSystemVersionUsecase } from "features/system-version/domain/usecases/update_system_version.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [SystemVersionController],
  providers: [
    SystemVersionServiceFactory,
    CreateSystemVersionUseCase,
    DeleteSystemVersionUsecase,
    UpdateSystemVersionUsecase,
    ListSystemVersionUsecase,
  ],
})
export class SystemVersionModule {}
