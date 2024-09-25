import { Module } from "@nestjs/common";
import { PrismaModule } from "../auth/database/prisma.module";

@Module({
  imports: [PrismaModule],
  exports: [PrismaModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
