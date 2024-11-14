import { Module } from "@nestjs/common";
import { CalledController } from "./called.controller";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { FindAllCalledUseCase } from "features/called/domain/usecases/find-all.usecase";
import { DeleteCalledUsecase } from "features/called/domain/usecases/delete.usecase";
import { calledServiceFactory } from "features/called/data";
import { CreateCalledUseCase } from "features/called/domain/usecases/create.usecase";
import { UpdateCalledUseCase } from "features/called/domain/usecases/update.usecase";
import { FindCalledByIdUseCase } from "features/called/domain/usecases/find-id.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [CalledController],
  providers: [
    calledServiceFactory,
    FindAllCalledUseCase,
    DeleteCalledUsecase,
    CreateCalledUseCase,
    UpdateCalledUseCase,
    FindCalledByIdUseCase,
  ],
})
export class CalledModule {}
