import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { AuthenticateController } from "../sign-up/authenticate_controller";
import { CreatePageAccountController } from "../controllers/create_account_controller";
import { HttpModule } from "../http.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "@infra/auth/auth.module";
import { HttpExceptionFilter } from "@infra/auth/guards/httpException";
import { JwtStrategy } from "@infra/auth/guards/strategies/jwt.strategy";
import { envSchema } from "@infra/database/env/env";
import { PrismaModule } from "@infra/database/prisma.module";
import { MiddlewareAuth } from "@infra/middleware/middleware_auth.middleware";
import { LiderUserRepository } from "@infra/repositories/lider_user_repository";
import { PrismaLiderUserRepository } from "@infra/repositories/prisma/prisma_lider_user_repository";
import { UserAddUseCase } from "@common/domain/usecases/user_add.usecase";
import { PrismaService } from "@infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUseCase } from "@common/domain/usecases/signup.usecase";

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
      provide: UserAddUseCase.UseCase,
      useFactory: (userRepository: LiderUserRepository) =>
        new UserAddUseCase.UseCase(userRepository),
      inject: [LiderUserRepository],
    },
    {
      provide: LoginUseCase,
      useFactory: (prisma: PrismaService, jwt: JwtService) =>
        new LoginUseCase(prisma, jwt),
      inject: [PrismaService, JwtService],
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
      .exclude({ path: "login", method: RequestMethod.ALL })
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
