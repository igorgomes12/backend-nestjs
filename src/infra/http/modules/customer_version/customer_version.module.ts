import { PrismaModule } from "@infra/auth/database/prisma.module";
import { Module } from "@nestjs/common";
import { CustomerVersionController } from "./customer_version.controller";

import { CustomerVersionServiceFactory } from "features/customer-version/data/service";
import { CreateCustomerSystemUsecase } from "features/customer-version/domain/usecases/create_customer.usecases";
import { DeleteCustomerUsecase } from "features/customer-version/domain/usecases/delete_customer.usecases";
import { ListCustomerSystemUsecase } from "features/customer-version/domain/usecases/list_customer.usecases";
import { UpdateCustomerUseCase } from "features/customer-version/domain/usecases/update_customer.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [CustomerVersionController],
  providers: [
    CustomerVersionServiceFactory,
    DeleteCustomerUsecase,
    CreateCustomerSystemUsecase,
    ListCustomerSystemUsecase,
    UpdateCustomerUseCase,
  ],
})
export class CustomerVersionModule {}
