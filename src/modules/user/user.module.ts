import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HashModule } from '../hash/hash.module';
import { DatabaseModule } from '../database/database.module';
import { RoleModule } from '../role/role.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [HashModule, DatabaseModule, RoleModule, MailerModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
