export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function resolveEnv(name: string, devDefault: string): string {
  const value = process.env[name];

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
