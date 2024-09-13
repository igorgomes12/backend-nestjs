import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";
import type { TEnv } from "../env/env";

// Expanda o schema para incluir todos os campos necessários
export const userPayloadSchema = z.object({
  sub: z.number(),
  name: z.string(), // Adicione o campo de username
  profile: z.string(),  // Adicione o campo de profile
});
export type UserPayloadForm = z.infer<typeof userPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<TEnv, true>) {
    const publicKey = configService.get("JWT_PUBLIC_KEY", { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, "base64"),
      algorithms: ["RS256"],
    });
  }

  async validate(payload: UserPayloadForm) {
    console.log('Payload recebido:', payload); 
    return userPayloadSchema.parse(payload);
  }
}

