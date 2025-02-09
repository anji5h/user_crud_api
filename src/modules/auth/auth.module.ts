import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashModule } from '../hash/hash.module';
import { DatabaseModule } from '../database/database.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [HashModule, DatabaseModule, TokenModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
