import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
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
import { ClientModule } from "../infra/http/client/client.module";
import { HttpModule } from "../infra/auth/http.module";
import { AuthenticateController } from "../infra/http/sign-up/authenticate_controller";
import { AppController } from "../infra/http/user/app.controller";
import { EstablishmentModule } from "../infra/http/establishment/establishment.module";
import { AccoutingModule } from "../infra/http/accouting/accouting.module";
import { SystemsModule } from "../infra/http/systems/systems.module";
import { SystemVersionModule } from "../infra/http/system_version/system_version.module";
import { CustomerVersionModule } from "@infra/http/customer_version/customer_version.module";
import { FindAllUserUseCase } from "features/user/domain/usecases/find_all_user.usecase";
import { UserServiceFactory } from "features/user/data/service";
import { CreateUserUseCase } from "features/user/domain/usecases/create_user.usecase";
import { DeleteUserUsecase } from "features/user/domain/usecases/delete_user.usecase";
import { UpdateUserUsecase } from "features/user/domain/usecases/update_user.usecase";

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
    CustomerVersionModule,
  ],
  controllers: [AppController, AuthenticateController],
  providers: [
    JwtStrategy,
    MiddlewareAuth,
    FindAllUserUseCase,
    CreateUserUseCase,
    DeleteUserUsecase,
    UpdateUserUsecase,
    UserServiceFactory,

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
