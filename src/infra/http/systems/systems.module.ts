import { Module } from "@nestjs/common";
import { SystemsService } from "./systems.service";
import { SystemsController } from "./systems.controller";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { FindAllSystemsUseCase } from "./usecases/system.usecases";
import { CreateSystemUsecase } from "./usecases/create_system.usecases";
import { UpdateSystemUsecase } from "./usecases/update_system.usecases";
import { DeleteSystemUsecase } from "./usecases/delete_system.usecases";
import { SystemRepository } from "./repositories/system_prisma.repositories";

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
