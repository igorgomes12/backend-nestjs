import { Module } from "@nestjs/common";
import { SystemsController } from "./systems.controller";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { SystemRepository } from "./repositories/system_prisma.repositories";
import { SystemsService } from "@common/domain/service/service_system/systems.service";
import { CreateSystemUsecase } from "@common/domain/usecases/usecases_system/create_system.usecases";
import { DeleteSystemUsecase } from "@common/domain/usecases/usecases_system/delete_system.usecases";
import { FindAllSystemsUseCase } from "@common/domain/usecases/usecases_system/system.usecases";
import { UpdateSystemUsecase } from "@common/domain/usecases/usecases_system/update_system.usecases";

@Module({
  imports: [PrismaModule],
  controllers: [SystemsController],
  providers: [
    SystemsService,
    PrismaService,
    {
      provide: "ISystemRepository",
      useClass: SystemRepository,
    },
    FindAllSystemsUseCase,
    CreateSystemUsecase,
    UpdateSystemUsecase,
    DeleteSystemUsecase,
  ],
})
export class SystemsModule {}
