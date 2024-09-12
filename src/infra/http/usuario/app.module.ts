import { AuthModule } from "@/infra/auth/auth.module";
import { PrismaModule } from "@/infra/database/prisma.module";
import { envSchema } from "@/infra/env/env";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { JwtStrategy } from "@/infra/auth/jwt.strategy";
import { LiderUserRepository } from "@/infra/repositories/lider_user_repository";
import { PrismaLiderUserRepository } from "@/infra/repositories/prisma/prisma_lider_user_repository";
import { AuthenticateController } from "../controllers/authenticate_controller";
import { CreatePageAccountController } from "../controllers/create_account_controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    AppController,
    AuthenticateController,
    CreatePageAccountController,
  ],
  providers: [
    JwtStrategy,
    AppService,
    {
      provide: LiderUserRepository,
      useClass: PrismaLiderUserRepository,
    },
  ],
})
export class AppModule {}