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
    // Buscar o usuário pelo email
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, profile: true, password: true },
    });

    // Verificar se o usuário existe
    if (!user) {
      throw new UnauthorizedException("As credenciais não conferem");
    }

    // Comparar a senha fornecida com o hash armazenado
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("As credenciais não conferem");
    }

    // Gerar o token JWT com o payload adequado
    const payload = {
      sub: user.id, // ID do usuário
      name: user.name, // Nome do usuário
      profile: user.profile, // Perfil do usuário (caso seja um objeto, verifique o que precisa ser incluído)
    };

    const accessToken = this.jwt.sign(payload);

    return {
      access_token: accessToken, // Retorna o token JWT
    };
  }
}
