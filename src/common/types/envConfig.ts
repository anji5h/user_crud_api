export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export interface IEnvConfig {
  NODE_ENV: Environment;
  PORT: number;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRE: number;
  REFRESH_TOKEN_EXPIRE: number;
  DATABASE_URL: string;
}
