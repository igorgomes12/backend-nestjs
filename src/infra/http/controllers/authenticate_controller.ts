import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { ZodValidationPipe } from "@/infra/http/pipes/zod_validation_pipes";
import { z } from "zod";

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z
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
    const { email, password } = body;
  
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, profile: true, password: true },
    });
    if (!user) {
      throw new UnauthorizedException("As credenciais não conferem");
    }
  
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("As credenciais não conferem");
    }
  
    const accessToken = this.jwt.sign({
      sub: user.id,
      name: user.name,
      profile: user.profile,
    });
  
    return {
      access_token: accessToken,
    };
  }
}
