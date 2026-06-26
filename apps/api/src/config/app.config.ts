import { registerAs } from '@nestjs/config';
import { resolveEnv } from './env';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? '3000'),
  webUrl: resolveEnv('APP_WEB_URL', 'http://localhost:8081'),
  corsOrigin: resolveEnv('CORS_ORIGIN', 'http://localhost:8081'),
}));
