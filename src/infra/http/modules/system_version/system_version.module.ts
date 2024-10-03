import { Module } from "@nestjs/common";
import { SystemVersionController } from "./system_version.controller";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { SystemVersionPrismaRepositories } from "./repositories/system_version_prisma.repositories";

import { SystemVersionService } from "@common/domain/service/service_system_version/system_version.service";
import { CreateSystemVersionUseCase } from "@common/domain/usecases/usecases_system_version/create_system_version.usecases";
import { DeleteSystemVersionUsecase } from "@common/domain/usecases/usecases_system_version/delete_system_version.usecases";
import { ListSystemVersionUsecase } from "@common/domain/usecases/usecases_system_version/list_system_version.usecase";
import { UpdateSystemVersionUsecase } from "@common/domain/usecases/usecases_system_version/update_system_version.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [SystemVersionController],
  providers: [
    SystemVersionService,
    PrismaService,
    {
      provide: "ISystemVersionRepository",
      useClass: SystemVersionPrismaRepositories,
    },
    CreateSystemVersionUseCase,
    DeleteSystemVersionUsecase,
    UpdateSystemVersionUsecase,
    ListSystemVersionUsecase,
  ],
})
export class SystemVersionModule {}
