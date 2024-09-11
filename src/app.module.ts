import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./database/prisma.module";
import { LiderUserRepository } from "./repositories/lider_user_repository";
import { PrismaLiderUserRepository } from "./repositories/prisma/prisma_lider_user_repository";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateController } from "./controllers/authenticate_controller";
import { CreatePageAccountController } from "./controllers/create_account_controller";
import { JwtStrategy } from "./auth/jwt.strategy";

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
      provide: LiderUserRepository, // injeção de dependencia
      useClass: PrismaLiderUserRepository,
    },
  ],
})
export class AppModule {}
