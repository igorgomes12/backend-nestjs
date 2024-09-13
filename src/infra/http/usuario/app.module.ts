import { AuthModule } from "@/infra/auth/auth.module";
import { JwtStrategy } from "@/infra/auth/jwt.strategy";
import { PrismaModule } from "@/infra/database/prisma.module";
import { envSchema } from "@/infra/env/env";
import { MiddlewareAuth } from "@/infra/middleware/middleware_auth.middleware";
import { LiderUserRepository } from "@/infra/repositories/lider_user_repository";
import { PrismaLiderUserRepository } from "@/infra/repositories/prisma/prisma_lider_user_repository";
import { Module, RequestMethod, type MiddlewareConsumer, type NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthenticateController } from "../controllers/authenticate_controller";
import { CreatePageAccountController } from "../controllers/create_account_controller";
import { HttpModule } from "../http.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    PrismaModule, // Certifique-se de que este módulo está importado
    HttpModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareAuth)
      .forRoutes({ path: '/sessions', method: RequestMethod.ALL });
  }
}