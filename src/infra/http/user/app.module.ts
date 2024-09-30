import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { MiddlewareAuth } from "@infra/repositories/middleware/middleware_auth.middleware";
import { LiderUserRepository } from "@infra/repositories/lider_user_repository";
import { PrismaLiderUserRepository } from "@infra/repositories/prisma/prisma_lider_user_repository";
import { LoginUseCase } from "@common/domain/usecases/usecases_sign_in/signup.usecase";
import { UserAddUseCase } from "@common/domain/usecases/usecases_user/user_add.usecase";
import { JwtStrategy } from "@infra/auth/guards/strategies/jwt.strategy";
import { envSchema } from "@infra/auth/database/env/env";
import { AuthModule } from "@infra/auth/auth.module";
import { ClientModule } from "../client/client.module";
import { HttpModule } from "../http.module";
import { AuthenticateController } from "../sign-up/authenticate_controller";
import { AppController } from "./app.controller";
import { EstablishmentModule } from "../establishment/establishment.module";
import { AccoutingModule } from "../accouting/accouting.module";
import { SystemsModule } from "../systems/systems.module";
import { SystemVersionModule } from "../system_version/system_version.module";
import { AppService } from "@common/domain/service/service_user/app.service";

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    ClientModule,
    EstablishmentModule,
    AccoutingModule,
    SystemsModule,
    SystemVersionModule,
  ],
  controllers: [AppController, AuthenticateController],
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer;
    // .apply(MiddlewareAuth)
    // .exclude({ path: "login", method: RequestMethod.ALL })
    // .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
