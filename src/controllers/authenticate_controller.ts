import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { PrismaService } from "src/database/prisma.service";
import { ZodValidationPipe } from "src/pipes/zod_validation_pipes";
import { z } from "zod";

export const authenticateBodySchema = z.object({
  email_login_user: z.string().email(),
  password_user: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});
export type TAuthenticateBodyForm = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: TAuthenticateBodyForm) {
    const { email_login_user, password_user } = body;

    const user = await this.prisma.user.findUnique({
      where: { email_login_user },
    });
    if (!user) {
      throw new UnauthorizedException("As credenciais não conferem");
    }
    const isPasswordValid = await compare(password_user, user.password_user);
    if (!isPasswordValid) {
      throw new UnauthorizedException("As credenciais não conferem");
    }

    const acessToken = this.jwt.sign({ sub: user.id });
    return {
      access_token: acessToken,
    };
  }
}
