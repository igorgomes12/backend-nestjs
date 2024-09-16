import { AuthModule } from "@/infra/auth/auth.module";
import { PrismaModule } from "@/infra/database/prisma.module";
import { envSchema } from "@/infra/env/env";
import { MiddlewareAuth } from "@/infra/middleware/middleware_auth.middleware";
import { LiderUserRepository } from "@/infra/repositories/lider_user_repository";
import { PrismaLiderUserRepository } from "@/infra/repositories/prisma/prisma_lider_user_repository";
import { Module, RequestMethod, type MiddlewareConsumer, type NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthenticateController } from "../../auth/authenticate_controller";
import { CreatePageAccountController } from "../controllers/create_account_controller";
import { HttpModule } from "../http.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtStrategy } from "@/infra/auth/guards/strategies/jwt.strategy";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "@/infra/auth/guards/httpException";

@Module({
  imports: [
    PrismaModule,
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
    MiddlewareAuth,
    AppService,
    {
      provide: LiderUserRepository,
      useClass: PrismaLiderUserRepository,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareAuth)
      .exclude(
        { path: 'login', method: RequestMethod.ALL } // Exclui a rota de login
      )
      .forRoutes(
        { path: '*', method: RequestMethod.ALL } // Aplica o middleware a todas as outras rotas
      );
  }
}