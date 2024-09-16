import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";
import type { TEnv } from "../../../env/env";

// Atualize o esquema para refletir a estrutura correta
export const userPayloadSchema = z.object({
  sub: z.number(),
  name: z.string(),
  profile: z.object({
    id: z.string(), // Mantém como string
    name: z.string(),
  }),  
  iat: z.number(),
  exp: z.number(),
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

  async validate(payload: any) {
    console.log('Payload recebido:', payload);  
    return userPayloadSchema.parse(payload);
  }
}