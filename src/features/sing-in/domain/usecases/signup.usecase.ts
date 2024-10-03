import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";

export class LoginUseCase {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async execute(email: string, password: string) {
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

    const payload = {
      sub: user.id,
      name: user.name,
      profile: user.profile,
    };

    const accessToken = this.jwt.sign(payload);

    return {
      access_token: accessToken,
    };
  }
}
