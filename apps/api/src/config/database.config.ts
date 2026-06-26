import { registerAs } from '@nestjs/config';
import { resolveEnv } from './env';

export const databaseConfig = registerAs('database', () => ({
  url: resolveEnv(
    'DATABASE_URL',
    'postgresql://user:password@localhost:5432/flashcards?schema=public',
  ),
}));
