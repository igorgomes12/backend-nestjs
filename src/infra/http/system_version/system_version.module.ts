import { Module } from "@nestjs/common";
import { SystemVersionService } from "./system_version.service";
import { SystemVersionController } from "./system_version.controller";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { SystemVersionPrismaRepositories } from "./repositories/system_version_prisma.repositories";
import { CreateSystemVersionUseCase } from "./usecases/create_system_version.usecases";
import { DeleteSystemVersionUsecase } from "./usecases/delete_system_version.usecases";

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
  ],
})
export class SystemVersionModule {}
