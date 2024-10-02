import { Module } from "@nestjs/common";
import { CustomerVersionService } from "./customer_version.service";
import { CustomerVersionController } from "./customer_version.controller";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { CustomerSystemVersionRepositories } from "./repositories/customer_system_version.repositories";
import { DeleteCustomerUsecase } from "./usecases/delete_customer.usecases";
import { CreateCustomerSystemUsecase } from "./usecases/create_customer.usecases";

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
  ],
})
export class CustomerVersionModule {}
