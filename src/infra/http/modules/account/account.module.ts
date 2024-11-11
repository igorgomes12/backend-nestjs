import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { accountServiceFactory } from "features/account/data/service";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { CreateAccountUsecase } from "features/account/domain/usecases/create.usecase";
import { FindAllAccountUseCase } from "features/account/domain/usecases/find-all.usecase";
import { UpdateAccountUseCase } from "features/account/domain/usecases/update.usecase";
import { DeleteAccountUseCase } from "features/account/domain/usecases/delete.usecase";
import { FindAccountByIdUseCase } from "features/account/domain/usecases/find-id.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [AccountController],
  providers: [
    accountServiceFactory,
    FindAllAccountUseCase,
    CreateAccountUsecase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,
    FindAccountByIdUseCase,
  ],
})
export class AccountModule {}
