import { Module } from "@nestjs/common";
import { DescriptionCalledController } from "./description_called.controller";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { DescriptionCalledServiceFactory } from "features/description-called/data/service";
import { FindAllDescriptionCalledUseCase } from "features/description-called/domain/usecases/find-all-description-called";
import { CreateDescriptionCalledUseCase } from "features/description-called/domain/usecases/create-description-called";
import { EditDescriptionCalledUseCase } from "features/description-called/domain/usecases/edit-description-called";
import { DeleteDescriptionCalledUseCase } from "features/description-called/domain/usecases/delete-description-called";

@Module({
  imports: [PrismaModule],
  controllers: [DescriptionCalledController],
  providers: [
    DescriptionCalledServiceFactory,
    FindAllDescriptionCalledUseCase,
    CreateDescriptionCalledUseCase,
    EditDescriptionCalledUseCase,
    DeleteDescriptionCalledUseCase,
  ],
})
export class DescriptionCalledModule {}
