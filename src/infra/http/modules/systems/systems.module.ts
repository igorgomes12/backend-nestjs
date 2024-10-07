import { Module } from "@nestjs/common";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { SystemsController } from "../systems/systems.controller";
import { CreateSystemUsecase } from "features/systems/domain/usecases/create_system.usecases";
import { DeleteSystemUsecase } from "features/systems/domain/usecases/delete_system.usecases";
import { FindAllSystemsUseCase } from "features/systems/domain/usecases/system.usecases";
import { UpdateSystemUsecase } from "features/systems/domain/usecases/update_system.usecases";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { SystemPrismaRepository } from "features/systems/data/service/prisma/systems-prisma.service";

@Module({
  imports: [PrismaModule],
  controllers: [SystemsController],
  providers: [
    PrismaService,
    {
      provide: SystemPrismaRepository,
      useClass: SystemPrismaRepository,
    },
    FindAllSystemsUseCase,
    CreateSystemUsecase,
    UpdateSystemUsecase,
    DeleteSystemUsecase,
  ],
})
export class SystemsModule {}
