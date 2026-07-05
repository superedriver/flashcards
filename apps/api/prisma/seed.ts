import 'dotenv/config';

import * as argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client';

const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'demo-password-123';
const DEMO_DISPLAY_NAME = 'Demo User';
const PRIVATE_DECK_TITLE = 'Demo Spanish Basics';
const PUBLIC_DECK_TITLE = 'Demo Public Phrases';

const PRIVATE_DECK_CARDS = [
  { front: 'hello', back: 'hola', example: 'Hello, how are you?' },
  { front: 'goodbye', back: 'adiós', example: 'Goodbye, see you tomorrow.' },
  { front: 'thank you', back: 'gracias', example: 'Thank you for your help.' },
] as const;

const PUBLIC_DECK_CARDS = [
  { front: 'water', back: 'agua', example: 'I need water.' },
  { front: 'food', back: 'comida', example: 'The food is good.' },
] as const;

function assertSafeToSeed(): void {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.ALLOW_PRODUCTION_SEED !== 'true'
  ) {
    throw new Error(
      'Refusing to seed production database. Set ALLOW_PRODUCTION_SEED=true only for controlled environments.',
    );
  }
}

function createPrismaClient(): { prisma: PrismaClient; pool: Pool } {
  const connectionString =
    process.env.DATABASE_URL ??
    'postgresql://user:password@localhost:5432/flashcards?schema=public';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return {
    prisma: new PrismaClient({ adapter }),
    pool,
  };
}

async function upsertDemoUser(prisma: PrismaClient) {
  const passwordHash = await argon2.hash(DEMO_PASSWORD);
  const now = new Date();

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    create: {
      email: DEMO_EMAIL,
      passwordHash,
      emailVerifiedAt: now,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      profile: {
        create: {
          displayName: DEMO_DISPLAY_NAME,
        },
      },
      settings: {
        create: {},
      },
    },
    update: {
      passwordHash,
      emailVerifiedAt: now,
      blockedAt: null,
      deletedAt: null,
    },
    include: {
      profile: true,
      settings: true,
    },
  });

  if (!user.profile) {
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        displayName: DEMO_DISPLAY_NAME,
      },
    });
  } else if (!user.profile.displayName) {
    await prisma.userProfile.update({
      where: { userId: user.id },
      data: { displayName: DEMO_DISPLAY_NAME },
    });
  }

  if (!user.settings) {
    await prisma.userSettings.create({
      data: { userId: user.id },
    });
  }

  return user;
}

async function ensureDeckWithCards(
  prisma: PrismaClient,
  input: {
    ownerId: string;
    title: string;
    description: string;
    visibility: 'PRIVATE' | 'PUBLIC';
    moderationStatus: 'NONE' | 'APPROVED';
    cards: ReadonlyArray<{
      front: string;
      back: string;
      example?: string;
    }>;
  },
) {
  let deck = await prisma.deck.findFirst({
    where: {
      ownerId: input.ownerId,
      title: input.title,
      deletedAt: null,
    },
  });

  if (!deck) {
    deck = await prisma.deck.create({
      data: {
        ownerId: input.ownerId,
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        moderationStatus: input.moderationStatus,
      },
    });
  } else {
    deck = await prisma.deck.update({
      where: { id: deck.id },
      data: {
        description: input.description,
        visibility: input.visibility,
        moderationStatus: input.moderationStatus,
        deletedAt: null,
      },
    });
  }

  const existingCards = await prisma.card.findMany({
    where: {
      deckId: deck.id,
      deletedAt: null,
    },
    select: { front: true },
  });
  const existingFronts = new Set(existingCards.map((card) => card.front));

  for (const [index, card] of input.cards.entries()) {
    if (existingFronts.has(card.front)) {
      continue;
    }

    await prisma.card.create({
      data: {
        deckId: deck.id,
        front: card.front,
        back: card.back,
        example: card.example,
        position: index,
      },
    });
  }

  return deck;
}

async function main() {
  assertSafeToSeed();

  const { prisma, pool } = createPrismaClient();

  try {
    await prisma.$connect();

    const user = await upsertDemoUser(prisma);

    const privateDeck = await ensureDeckWithCards(prisma, {
      ownerId: user.id,
      title: PRIVATE_DECK_TITLE,
      description: 'Local-only demo deck for smoke testing.',
      visibility: 'PRIVATE',
      moderationStatus: 'NONE',
      cards: PRIVATE_DECK_CARDS,
    });

    const publicDeck = await ensureDeckWithCards(prisma, {
      ownerId: user.id,
      title: PUBLIC_DECK_TITLE,
      description: 'Local-only public demo deck for browse/copy smoke tests.',
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
      cards: PUBLIC_DECK_CARDS,
    });

    console.log('Demo seed completed (local development only).');
    console.log(`Demo user email: ${DEMO_EMAIL}`);
    console.log(`Demo user password: ${DEMO_PASSWORD}`);
    console.log(`Private demo deck: ${privateDeck.title}`);
    console.log(`Public demo deck: ${publicDeck.title}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main().catch((error: unknown) => {
  console.error('Demo seed failed.');
  console.error(error);
  process.exit(1);
});
