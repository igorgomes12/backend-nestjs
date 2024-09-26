import { Module } from "@nestjs/common";
import { AccoutingService } from "./accouting.service";
import { AccoutingController } from "./accouting.controller";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { PrismaModule } from "@infra/auth/database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AccoutingController],
  providers: [AccoutingService, PrismaService],
})
export class AccoutingModule {}
