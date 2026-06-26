import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { resolveEnv } from './src/config/env';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: resolveEnv(
      'DATABASE_URL',
      'postgresql://user:password@localhost:5432/flashcards?schema=public',
    ),
  },
});
