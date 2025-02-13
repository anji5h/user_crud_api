export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export interface IConfig {
  NODE_ENV: Environment;
  PORT: number;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  TOKEN_SECRET: string;
  TOKEN_EXPIRE: number;
  SESSION_EXPIRE: number;
  DATABASE_URL: string;
  MAILER_HOST: string;
  MAILER_PORT: number;
  MAILER_USER: string;
  MAILER_PASS: string;
  MAILER_FROM: string;
  OTP_EXPIRE: number
}
