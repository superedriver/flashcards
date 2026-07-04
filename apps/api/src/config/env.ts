const DEV_PLACEHOLDER_PREFIX = 'replace-with-dev';

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function resolveEnv(name: string, devDefault: string): string {
  const value = process.env[name]?.trim();

  if (value) {
    return value;
  }

  if (isProduction()) {
    throw new Error(
      `Missing required production environment variable: ${name}`,
    );
  }

  return devDefault;
}

export function assertProductionSecret(name: string): void {
  if (!isProduction()) {
    return;
  }

  const value = process.env[name]?.trim();

  if (!value || value.startsWith(DEV_PLACEHOLDER_PREFIX)) {
    throw new Error(
      `Missing required production environment variable: ${name}`,
    );
  }
}

export function validateProductionEnvironment(): void {
  if (!isProduction()) {
    return;
  }

  resolveEnv(
    'DATABASE_URL',
    'postgresql://user:password@localhost:5432/flashcards?schema=public',
  );
  resolveEnv('APP_WEB_URL', 'http://localhost:8081');
  resolveEnv('CORS_ORIGIN', 'http://localhost:8081');
  resolveEnv('JWT_ACCESS_SECRET', 'replace-with-dev-access-secret');
  resolveEnv('JWT_REFRESH_SECRET', 'replace-with-dev-refresh-secret');
  resolveEnv('INTERNAL_JOB_SECRET', 'replace-with-dev-internal-job-secret');

  assertProductionSecret('JWT_ACCESS_SECRET');
  assertProductionSecret('JWT_REFRESH_SECRET');
  assertProductionSecret('INTERNAL_JOB_SECRET');

  const emailProvider = (process.env.EMAIL_PROVIDER ?? 'dev').toLowerCase();

  if (emailProvider === 'resend') {
    assertProductionSecret('RESEND_API_KEY');
    getRequiredEnv('EMAIL_FROM');
  } else if (emailProvider === 'brevo') {
    assertProductionSecret('BREVO_API_KEY');
    getRequiredEnv('EMAIL_FROM');
  }

  const aiProvider = (process.env.AI_PROVIDER ?? 'mock').toLowerCase();

  if (aiProvider === 'gemini') {
    assertProductionSecret('AI_API_KEY');
  }
}
