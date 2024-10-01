import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./ioC/app.module";
import { TEnv } from "./infra/auth/database/env/env";
import { AllExceptionsFilter } from "core/filters/exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get<ConfigService<TEnv, true>>(ConfigService);
  const port = configService.get("PORT", { infer: true });

  await app.listen(port);
}
bootstrap();
