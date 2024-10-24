import { envSchema } from "@infra/auth/database/env/env";
import { PrismaModule } from "@infra/auth/database/prisma.module";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";

import { MiddlewareAuth } from "@infra/http/middleware/middleware_auth.middleware";

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserServiceFactory } from "features/user/data/service";
import { CreateUserUseCase } from "features/user/domain/usecases/create_user.usecase";
import { DeleteUserUsecase } from "features/user/domain/usecases/delete_user.usecase";
import { FindAllUserUseCase } from "features/user/domain/usecases/find_all_user.usecase";
import { UpdateUserUsecase } from "features/user/domain/usecases/update_user.usecase";
import { HttpModule } from "../infra/auth/jwt/http.module";

import { AuthModule } from "@infra/auth/jwt/auth.module";
import { JwtStrategy } from "@infra/http/guards/strategies/jwt.strategy";
import { AccoutingModule } from "@infra/http/modules/accouting/accouting.module";
import { ClientModule } from "@infra/http/modules/client/client.module";
import { CustomerVersionModule } from "@infra/http/modules/customer_version/customer_version.module";
import { EstablishmentModule } from "@infra/http/modules/establishment/establishment.module";
import { FormsPaymentModule } from "@infra/http/modules/forms-payment/forms-payment.module";
import { LincesesModule } from "@infra/http/modules/linceses/linceses.module";
import { RepresentativeModule } from "@infra/http/modules/representative/representative.module";
import { SystemVersionModule } from "@infra/http/modules/system_version/system_version.module";
import { SystemsModule } from "@infra/http/modules/systems/systems.module";
import { accountingServiceFactory } from "features/accouting/data/service";
import { EstablishmentServiceFactory } from "features/establishment/data/service";
import { paymentServiceFactory } from "features/forms-payment/data";
import { representativeServiceFactory } from "features/representative/data/service";
import { LoginUseCase } from "features/sing-in/domain/usecases/signup.usecase";
import { AuthenticateController } from "../infra/http/modules/sign-up/authenticate_controller";
import { AppController } from "../infra/http/modules/user/app.controller";

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
    LincesesModule,
    RepresentativeModule,
    FormsPaymentModule,
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
    AccoutingModule,
    EstablishmentServiceFactory,
    accountingServiceFactory,
    representativeServiceFactory,
    paymentServiceFactory,
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
