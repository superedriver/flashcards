import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { seedLanguages } from './seeds/languages.seed';

async function main() {
  const connectionString =
    process.env.DATABASE_URL ??
    'postgresql://user:password@localhost:5432/flashcards?schema=public';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    const count = await seedLanguages(prisma);
    console.log(`Seeded ${count} languages.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main().catch((error: unknown) => {
  console.error('Production seed failed.');
  console.error(error);
  process.exit(1);
});
