import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';
import { Environment, IEnvConfig } from 'src/common/types/envConfig';

class EnvironmentVariables implements IEnvConfig {
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
  ACCESS_TOKEN_SECRET: string;

  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRE: number;

  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRE: number;

  @IsNotEmpty()
  DATABASE_URL: string;
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
