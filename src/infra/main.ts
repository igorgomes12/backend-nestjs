import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { TEnv } from "./env/env";
import { AppModule } from "./http/usuario/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,    
  }));

  const configService = app.get<ConfigService<TEnv, true>>(ConfigService);
  const port = configService.get("PORT", { infer: true });

  await app.listen(port);
}
bootstrap();
