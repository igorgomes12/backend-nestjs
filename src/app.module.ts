import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './database/prisma.module'
import { LiderUserRepository } from './repositories/lider_user_repository'
import { PrismaLiderUserRepository } from './repositories/prisma/prisma_lider_user_repository'

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: LiderUserRepository, // injeção de dependencia
      useClass: PrismaLiderUserRepository,
    },
  ],
})
export class AppModule {}
