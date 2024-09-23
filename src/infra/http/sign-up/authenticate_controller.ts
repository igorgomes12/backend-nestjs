import { LoginUseCase } from "@common/domain/usecases/signup.usecase";
import {
  authenticateBodySchema,
  type TAuthenticateBodyForm,
} from "@common/domain/validator/zod_validator_fields";
import { PrismaService } from "@infra/database/prisma/prisma.service";
import { ZodValidationPipe } from "@infra/middleware/pipes/zod_validation_pipes";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Controller()
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
