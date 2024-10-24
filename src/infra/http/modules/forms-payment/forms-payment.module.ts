import { PrismaModule } from "@infra/auth/database/prisma.module";
import { Module } from "@nestjs/common";
import { paymentServiceFactory } from "features/forms-payment/data";
import { CreatePaymentUseCase } from "features/forms-payment/domain/usecases/create.usecase";
import { DeletePaymentUseCase } from "features/forms-payment/domain/usecases/delete.usecase";
import { FindAllPaymentTypes } from "features/forms-payment/domain/usecases/find-all.usecase";
import { UpdatePaymentUsecase } from "features/forms-payment/domain/usecases/update.usecase";
import { FormsPaymentController } from "./forms-payment.controller";

@Module({
  imports: [PrismaModule],
  controllers: [FormsPaymentController],
  providers: [
    paymentServiceFactory,
    FindAllPaymentTypes,
    CreatePaymentUseCase,
    DeletePaymentUseCase,
    UpdatePaymentUsecase,
  ],
})
export class FormsPaymentModule {}
