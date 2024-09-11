import { Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt_auth.guard";
import { CurrentUser } from "src/auth/current-user-decorator";
import type { userPayloadForm } from "src/auth/jwt.strategy";

@Controller("/page")
@UseGuards(JwtAuthGuard)
export class CreatePageAccountController {
  constructor() {}

  @Post()
  async handle(@CurrentUser() user: userPayloadForm) {
    console.log(user.sub);
    return "ok";
  }
}
