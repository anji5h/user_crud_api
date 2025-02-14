import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HashModule } from '../hash/hash.module';
import { RoleModule } from '../role/role.module';
import { SessionModule } from '../session/session.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HashModule, DatabaseModule, SessionModule, RoleModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
