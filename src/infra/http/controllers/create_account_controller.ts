
import { CurrentUser } from "@infra/auth/guards/decorators/current-user.decorator";
import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { UserPayloadForm } from "@infra/auth/guards/strategies/jwt.strategy";
import { Controller, Post, UseGuards } from "@nestjs/common";


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
