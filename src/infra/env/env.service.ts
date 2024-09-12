import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TEnv } from './env'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<TEnv, true>) {}

  get<T extends keyof TEnv>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
