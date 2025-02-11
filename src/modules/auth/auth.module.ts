import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashModule } from '../hash/hash.module';
import { DatabaseModule } from '../database/database.module';
import { SessionModule } from '../token/session.module';

@Module({
  imports: [HashModule, DatabaseModule, SessionModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
