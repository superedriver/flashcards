import 'dotenv/config';

import * as argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { seedLanguages } from './seeds/languages.seed';

const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'demo-password-123';
const DEMO_DISPLAY_NAME = 'Demo User';
const PRIVATE_DECK_TITLE = 'Demo Spanish Basics';
const PUBLIC_DECK_TITLE = 'Demo Public Phrases';

const TARGET_LANGUAGE = 'es';
const SOURCE_LANGUAGE = 'en';
const LESSON_SIZE = 5;

const PRIVATE_DECK_CARDS = [
  { front: 'hello', back: 'hola', example: 'Hello, how are you?' },
  { front: 'goodbye', back: 'adiós', example: 'Goodbye, see you tomorrow.' },
  { front: 'thank you', back: 'gracias', example: 'Thank you for your help.' },
] as const;

const PUBLIC_DECK_CARDS = [
  { front: 'water', back: 'agua', example: 'I need water.' },
  { front: 'food', back: 'comida', example: 'The food is good.' },
] as const;

const QUEUE_DECKS = [
  {
    title: 'G1',
    description:
      'Home snapshot deck: first five cards in session, last two extras.',
    cards: [
      { front: 'apple', back: 'manzana' },
      { front: 'bread', back: 'pan' },
      { front: 'cheese', back: 'queso' },
      { front: 'milk', back: 'leche' },
      { front: 'wine', back: 'vino' },
      { front: 'oil', back: 'aceite' },
      { front: 'salt', back: 'sal' },
    ],
  },
  {
    title: 'G2',
    description: 'Second Home deck.',
    cards: [{ front: 'dog', back: 'perro' }],
  },
  {
    title: 'Q',
    description: 'Queue/gap deck. Start with river and forest only.',
    cards: [
      { front: 'river', back: 'río' },
      { front: 'forest', back: 'bosque' },
    ],
  },
  {
    title: 'S',
    description: 'Shrink and Start visibility deck.',
    cards: [{ front: 'one', back: 'uno' }],
  },
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
        create: {
          lessonSize: LESSON_SIZE,
          nativeLanguage: SOURCE_LANGUAGE,
          activeTargetLanguage: TARGET_LANGUAGE,
        },
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
      data: {
        userId: user.id,
        lessonSize: LESSON_SIZE,
        nativeLanguage: SOURCE_LANGUAGE,
        activeTargetLanguage: TARGET_LANGUAGE,
      },
    });
  } else {
    await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        lessonSize: LESSON_SIZE,
        nativeLanguage: SOURCE_LANGUAGE,
        activeTargetLanguage: TARGET_LANGUAGE,
      },
    });
  }

  await prisma.userStudyLanguage.upsert({
    where: {
      userId_languageCode: {
        userId: user.id,
        languageCode: TARGET_LANGUAGE,
      },
    },
    create: {
      userId: user.id,
      languageCode: TARGET_LANGUAGE,
    },
    update: {},
  });

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
    targetLanguage?: string;
    sourceLanguage?: string;
    cards: ReadonlyArray<{
      front: string;
      back: string;
      example?: string;
      createdAt?: Date;
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

  const languageData = {
    targetLanguage: input.targetLanguage ?? null,
    sourceLanguage: input.sourceLanguage ?? null,
  };

  if (!deck) {
    deck = await prisma.deck.create({
      data: {
        ownerId: input.ownerId,
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        moderationStatus: input.moderationStatus,
        ...languageData,
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
        ...languageData,
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
        ...(card.createdAt ? { createdAt: card.createdAt } : {}),
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

    const languageCount = await seedLanguages(prisma);
    console.log(`Seeded ${languageCount} languages.`);

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

    let cardCreatedAtMs = Date.parse('2026-08-01T00:00:00.000Z');

    for (const queueDeck of QUEUE_DECKS) {
      const cards = queueDeck.cards.map((card) => {
        const createdAt = new Date(cardCreatedAtMs);
        cardCreatedAtMs += 1000;
        return { ...card, createdAt };
      });

      await ensureDeckWithCards(prisma, {
        ownerId: user.id,
        title: queueDeck.title,
        description: queueDeck.description,
        visibility: 'PRIVATE',
        moderationStatus: 'NONE',
        targetLanguage: TARGET_LANGUAGE,
        sourceLanguage: SOURCE_LANGUAGE,
        cards,
      });
    }

    const queueCards = await prisma.card.findMany({
      where: {
        deletedAt: null,
        deck: {
          ownerId: user.id,
          deletedAt: null,
          title: {
            in: QUEUE_DECKS.map((deck) => deck.title),
          },
        },
      },
      select: { id: true },
    });

    await prisma.cardReviewState.createMany({
      data: queueCards.map((card) => ({
        userId: user.id,
        cardId: card.id,
        learningStep: 0,
        longReviewSuccessCount: 0,
        dueAt: new Date('2026-08-01T00:00:00.000Z'),
      })),
      skipDuplicates: true,
    });

    console.log('Demo seed completed (local development only).');
    console.log(`Demo user email: ${DEMO_EMAIL}`);
    console.log(`Demo user password: ${DEMO_PASSWORD}`);
    console.log(`Private demo deck: ${privateDeck.title}`);
    console.log(`Public demo deck: ${publicDeck.title}`);
    console.log(
      `Queue decks: ${QUEUE_DECKS.map((deck) => deck.title).join(', ')}`,
    );
    console.log(
      `Settings: lessonSize=${LESSON_SIZE} activeTarget=${TARGET_LANGUAGE} native=${SOURCE_LANGUAGE}`,
    );
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
