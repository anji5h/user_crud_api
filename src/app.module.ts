import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedModule } from './modules/seed/seed.module';
import { AuthModule } from './modules/auth/auth.module';
import { validate } from './validations/env.validation';
import { DatabaseModule } from './modules/database/database.module';
import { HashModule } from './modules/hash/hash.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from './modules/token/session.module';
import { IConfig } from './common/types/config.type';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { RoleGuard } from './common/guards/role.guard';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IConfig>) => ({
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRE'),
        },
        verifyOptions: {
          ignoreExpiration: false,
        },
      }),
    }),
    SeedModule,
    AuthModule,
    DatabaseModule,
    HashModule,
    SessionModule,
    RoleModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: RoleGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
