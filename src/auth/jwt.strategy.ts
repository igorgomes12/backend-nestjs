import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TEnv } from "src/env";
import { z } from "zod";

export const userPayloadSchema = z.object({
  sub: z.number(),
});
export type userPayloadForm = z.infer<typeof userPayloadSchema>;

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

  async validate(payload: userPayloadForm) {
    return userPayloadSchema.parse(payload);
  }
}
