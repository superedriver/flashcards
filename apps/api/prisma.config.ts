import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { getRequiredEnv } from './src/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: getRequiredEnv('DATABASE_URL'),
  },
});
