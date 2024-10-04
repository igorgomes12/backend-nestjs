import { Module } from "@nestjs/common";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { AccoutingController } from "./accouting.controller";
import { ListFindAllUseCase } from "features/accouting/domain/usecases/list-findAll.usecase";
import { accountingServiceFactory } from "features/accouting/data/service";
import { CreateAccountingUseCase } from "features/accouting/domain/usecases/create-accounting.usecase";
import { DeleteAccountUsecase } from "features/accouting/domain/usecases/delete-accounting.usecase";
import { UpdateAccountingUseCase } from "features/accouting/domain/usecases/update-acoounting.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [AccoutingController],
  providers: [
    accountingServiceFactory,
    ListFindAllUseCase,
    CreateAccountingUseCase,
    DeleteAccountUsecase,
    UpdateAccountingUseCase,
  ],
})
export class AccoutingModule {}
