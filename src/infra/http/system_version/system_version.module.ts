import { Module } from "@nestjs/common";
import { SystemVersionService } from "./system_version.service";
import { SystemVersionController } from "./system_version.controller";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { SystemVersionPrismaRepositories } from "./repositories/system_version_prisma.repositories";

@Module({
  imports: [PrismaModule],
  controllers: [SystemVersionController],
  providers: [
    SystemVersionService,
    PrismaService,
    {
      provide: "ISystemVersionRepository",
      useClass: SystemVersionPrismaRepositories,
    },
  ],
})
export class SystemVersionModule {}
