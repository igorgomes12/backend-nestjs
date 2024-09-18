import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import  { TEnv } from "../database/env/env";
import { JwtStrategy } from "./guards/strategies/jwt.strategy";


@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({     
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService<TEnv, true>) => {
        try {
          const privateKey = config.get("JWT_PRIVATE_KEY", { infer: true });
          const publicKey = config.get("JWT_PUBLIC_KEY", { infer: true });
          if (!privateKey || !publicKey) {
            throw new Error("JWT keys are not defined in the environment variables");
          }
          return {
            privateKey: Buffer.from(privateKey, "base64"),
            publicKey: Buffer.from(publicKey, "base64"),
            signOptions: { expiresIn: "1d", algorithm: "RS256" },
          };
        } catch (error) {
          console.error("Error loading JWT keys:", error);
          throw error;
        }
      }
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
