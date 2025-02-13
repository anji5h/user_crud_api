import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';
import { Environment, IConfig } from 'src/common/types/config.type';

class EnvironmentVariables implements IConfig {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  ADMIN_NAME: string;

  @IsNotEmpty()
  ADMIN_EMAIL: string;

  @IsNotEmpty()
  ADMIN_PASSWORD: string;

  @IsNotEmpty()
  TOKEN_SECRET: string;

  @IsNotEmpty()
  TOKEN_EXPIRE: number;

  @IsNotEmpty()
  SESSION_EXPIRE: number;

  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNotEmpty()
  MAILER_HOST: string;

  @IsNotEmpty()
  MAILER_PORT: number;

  @IsNotEmpty()
  MAILER_PASS: string;

  @IsNotEmpty()
  MAILER_USER: string;

  @IsNotEmpty()
  MAILER_FROM: string;

  @IsNotEmpty()
  OTP_EXPIRE: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
