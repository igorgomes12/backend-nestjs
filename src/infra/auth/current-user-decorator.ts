// Decorator para extrair o usuário atual do request
import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { UserPayloadForm } from "./guards/strategies/jwt.strategy";

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as UserPayloadForm;
  },
);