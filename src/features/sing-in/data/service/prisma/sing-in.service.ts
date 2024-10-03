import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SignInService implements SignInService {
  constructor(private readonly prisma: PrismaService) {}
}
