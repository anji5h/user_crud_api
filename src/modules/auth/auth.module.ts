import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [DatabaseModule, SessionModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
