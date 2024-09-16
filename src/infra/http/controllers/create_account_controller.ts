import { Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/guards/jwt_auth.guard";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayloadForm } from "@/infra/auth/guards/strategies/jwt.strategy";

@Controller("/page")
@UseGuards(JwtAuthGuard)
export class CreatePageAccountController {
  constructor() {}

  @Post()
  async handle(@CurrentUser() user: UserPayloadForm) {
    console.log(user.sub);
    return "ok";
  }
}
