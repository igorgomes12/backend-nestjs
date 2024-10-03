// Decorator para extrair o usuário atual do request
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayloadForm } from "../strategies/jwt.strategy";

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as UserPayloadForm;
  },
);