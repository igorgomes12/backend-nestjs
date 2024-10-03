import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import { Body, Controller, Post, UseFilters, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import {
  signInZodValidationDto,
  type TSingInValidationDto,
} from "features/sing-in/domain/dto/sign-in_zod_validation.dto";
import { LoginUseCase } from "features/sing-in/domain/usecases/signup.usecase";

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
  @UsePipes(new ZodValidationPipe(signInZodValidationDto))
  async handle(@Body() body: TSingInValidationDto) {
    const { email, password } = body;
    return await this.loginUseCase.execute(email, password);
  }
}
