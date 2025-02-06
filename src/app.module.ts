import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './modules/seed/seed.module';
import { AuthModule } from './modules/auth/auth.module';
import { validate } from './validations/env.validation';
import { DatabaseModule } from './modules/database/database.module';
import { HashModule } from './modules/hash/hash.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    SeedModule,
    AuthModule,
    DatabaseModule,
    HashModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
