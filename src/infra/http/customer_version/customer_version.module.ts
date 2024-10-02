import { Module } from "@nestjs/common";
import { CustomerVersionService } from "../../../common/domain/service/service_customer_system/customer_version.service";
import { CustomerVersionController } from "./customer_version.controller";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { CustomerSystemVersionRepositories } from "./repositories/customer_system_version.repositories";
import { DeleteCustomerUsecase } from "../../../common/domain/usecases/usecases_customer_system/delete_customer.usecases";
import { CreateCustomerSystemUsecase } from "../../../common/domain/usecases/usecases_customer_system/create_customer.usecases";
import { ListCustomerSystemUsecase } from "@common/domain/usecases/usecases_customer_system/list_customer.usecases";

@Module({
  imports: [PrismaModule],
  controllers: [CustomerVersionController],
  providers: [
    CustomerVersionService,
    PrismaService,
    {
      provide: "ICustomerSystemVersionRepositoryTypes",
      useClass: CustomerSystemVersionRepositories,
    },
    DeleteCustomerUsecase,
    CreateCustomerSystemUsecase,
    ListCustomerSystemUsecase,
  ],
})
export class CustomerVersionModule {}
