import { registerAs } from '@nestjs/config';
import { resolveEnv, validateProductionEnvironment } from './env';

const DEV_CORS_ORIGINS = [
  'http://localhost:8081',
  'http://localhost:19006',
  'http://127.0.0.1:8081',
  'http://127.0.0.1:19006',
] as const;

export function parseCorsOrigins(raw: string): string[] {
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export function resolveCorsOrigins(raw: string, nodeEnv: string): string[] {
  const parsed = parseCorsOrigins(raw);

  if (nodeEnv === 'production') {
    if (parsed.length === 0) {
      throw new Error(
        'Missing required production environment variable: CORS_ORIGIN',
      );
    }

    if (parsed.includes('*')) {
      throw new Error('Production CORS must not use wildcard origin');
    }

    return parsed;
  }

  if (parsed.length === 0) {
    return [...DEV_CORS_ORIGINS];
  }

  return [...new Set([...DEV_CORS_ORIGINS, ...parsed])];
}

export const appConfig = registerAs('app', () => {
  validateProductionEnvironment();

  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const corsOriginRaw = resolveEnv('CORS_ORIGIN', 'http://localhost:8081');

  return {
    nodeEnv,
    port: Number(process.env.PORT ?? '3000'),
    webUrl: resolveEnv('APP_WEB_URL', 'http://localhost:8081'),
    corsOrigins: resolveCorsOrigins(corsOriginRaw, nodeEnv),
    corsCredentials: true,
    internalJobSecret: resolveEnv(
      'INTERNAL_JOB_SECRET',
      'replace-with-dev-internal-job-secret',
    ),
  };
});
