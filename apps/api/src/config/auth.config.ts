import { registerAs } from '@nestjs/config';
import { resolveEnv } from './env';

export const authConfig = registerAs('auth', () => ({
  jwtAccessSecret: resolveEnv(
    'JWT_ACCESS_SECRET',
    'replace-with-dev-access-secret',
  ),
  jwtRefreshSecret: resolveEnv(
    'JWT_REFRESH_SECRET',
    'replace-with-dev-refresh-secret',
  ),
}));
