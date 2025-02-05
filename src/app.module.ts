import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './seeders/seeders.module';
import { HasherService } from './services/hasher/hasher.service';
import { PrismaService } from './services/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), SeederModule, AuthModule],
  controllers: [],
  providers: [HasherService, PrismaService],
})
export class AppModule {}
