import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { DatabaseModule } from '../../database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
