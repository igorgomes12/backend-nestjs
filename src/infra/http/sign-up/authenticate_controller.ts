import { LoginUseCase } from "@common/domain/usecases/usecases_sign_in/signup.usecase";
import {
  authenticateBodySchema,
  type TAuthenticateBodyForm,
} from "@common/domain/validator/zod_validator_fields";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { ZodValidationPipe } from "@infra/repositories/middleware/pipes/zod_validation_pipes";
import { Body, Controller, Post, UseFilters, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AllExceptionsFilter } from "core/filters/exception.filter";

@Controller()
@UseFilters(AllExceptionsFilter)
export class AuthenticateController {
  private loginUseCase: LoginUseCase;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {
    this.loginUseCase = new LoginUseCase(prisma, jwt);
  }

  @Post("login")
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: TAuthenticateBodyForm) {
    const { email, password } = body;
    return await this.loginUseCase.execute(email, password);
  }
}
