import { TEnv } from "@infra/auth/database/env/env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";

export const userPayloadSchema = z.object({
  sub: z.number(),
  name: z.string(),
  profile: z.object({
    id: z.number(),
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
    return userPayloadSchema.parse(payload);
  }
}
