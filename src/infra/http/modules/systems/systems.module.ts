import { PrismaModule } from "@infra/auth/database/prisma.module";
import { Module } from "@nestjs/common";
import { SystemsController } from "../systems/systems.controller";

import { SystemServiceFactory } from "features/systems/data/service";
import { CreateSystemUsecase } from "features/systems/domain/usecases/create_system.usecases";
import { DeleteSystemUsecase } from "features/systems/domain/usecases/delete_system.usecases";
import { FindAllSystemsUseCase } from "features/systems/domain/usecases/system.usecases";
import { UpdateSystemUsecase } from "features/systems/domain/usecases/update_system.usecases";

@Module({
  imports: [PrismaModule],
  controllers: [SystemsController],
  providers: [
    SystemServiceFactory,
    FindAllSystemsUseCase,
    CreateSystemUsecase,
    UpdateSystemUsecase,
    DeleteSystemUsecase,
  ],
})
export class SystemsModule {}
