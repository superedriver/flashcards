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
const CATALOG_EMAIL = 'catalog@example.com';
const CATALOG_DISPLAY_NAME = 'Catalog Owner';
const GROUP_NAME = 'Demo Study Group';
const GROUP_DECK_TITLE = 'Business Spanish';
const CATALOG_PUBLIC_DECK_TITLE = 'Spanish Basics';
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

const GROUP_DECK_CARDS = [
  { front: 'meeting', back: 'reunión' },
  { front: 'invoice', back: 'factura' },
] as const;

const CATALOG_PUBLIC_CARDS = [
  { front: 'house', back: 'casa' },
  { front: 'city', back: 'ciudad' },
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

async function upsertCatalogUser(prisma: PrismaClient) {
  const passwordHash = await argon2.hash(DEMO_PASSWORD);
  const now = new Date();

  return prisma.user.upsert({
    where: { email: CATALOG_EMAIL },
    create: {
      email: CATALOG_EMAIL,
      passwordHash,
      emailVerifiedAt: now,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      profile: {
        create: {
          displayName: CATALOG_DISPLAY_NAME,
        },
      },
    },
    update: {
      passwordHash,
      emailVerifiedAt: now,
      blockedAt: null,
      deletedAt: null,
    },
  });
}

async function ensureSharedGroupDeck(
  prisma: PrismaClient,
  input: {
    catalogUserId: string;
    demoUserId: string;
    deckId: string;
  },
) {
  let group = await prisma.group.findFirst({
    where: {
      name: GROUP_NAME,
      createdById: input.catalogUserId,
      deletedAt: null,
    },
  });

  if (!group) {
    group = await prisma.group.create({
      data: {
        name: GROUP_NAME,
        description: 'Local-only group so the demo user can see a shared deck.',
        createdById: input.catalogUserId,
      },
    });
  }

  await prisma.groupMember.upsert({
    where: {
      groupId_userId: {
        groupId: group.id,
        userId: input.catalogUserId,
      },
    },
    create: {
      groupId: group.id,
      userId: input.catalogUserId,
      role: 'OWNER',
    },
    update: {},
  });

  await prisma.groupMember.upsert({
    where: {
      groupId_userId: {
        groupId: group.id,
        userId: input.demoUserId,
      },
    },
    create: {
      groupId: group.id,
      userId: input.demoUserId,
      role: 'MEMBER',
    },
    update: {},
  });

  await prisma.deckGroupShare.upsert({
    where: {
      deckId_groupId: {
        deckId: input.deckId,
        groupId: group.id,
      },
    },
    create: {
      deckId: input.deckId,
      groupId: group.id,
      createdById: input.catalogUserId,
      permission: 'VIEW',
    },
    update: {
      deletedAt: null,
    },
  });
}

const LAYOUT_FIXTURE_USERS = [
  { email: 'maria.groups@example.com', displayName: 'Maria' },
  { email: 'sofia.groups@example.com', displayName: 'Sofia' },
  { email: 'alex.groups@example.com', displayName: 'Alex' },
  { email: 'nina.groups@example.com', displayName: 'Nina' },
  { email: 'dana.groups@example.com', displayName: 'Dana' },
  { email: 'kate.groups@example.com', displayName: 'Kate' },
  { email: 'liam.groups@example.com', displayName: 'Liam' },
  { email: 'jordan.groups@example.com', displayName: 'Jordan' },
  { email: 'morgan.groups@example.com', displayName: 'Morgan' },
  { email: 'tom.groups@example.com', displayName: 'Tom' },
  { email: 'emma.groups@example.com', displayName: 'Emma' },
  { email: 'rita.groups@example.com', displayName: 'Rita' },
  { email: 'pat.groups@example.com', displayName: 'Pat' },
  { email: 'lisa.groups@example.com', displayName: 'Lisa' },
  { email: 'omar.groups@example.com', displayName: 'Omar' },
] as const;

const LAYOUT_GROUPS = [
  {
    name: 'Spanish Learners',
    description: 'Practice Spanish vocabulary together.',
    ownerEmail: DEMO_EMAIL,
    memberEmails: [
      'maria.groups@example.com',
      'sofia.groups@example.com',
      'alex.groups@example.com',
      'nina.groups@example.com',
    ],
  },
  {
    name: 'Exam Prep Group',
    description: 'Cards and drills before the test.',
    ownerEmail: DEMO_EMAIL,
    memberEmails: [
      'dana.groups@example.com',
      'kate.groups@example.com',
      'liam.groups@example.com',
      'nina.groups@example.com',
      'alex.groups@example.com',
      'sofia.groups@example.com',
      'maria.groups@example.com',
    ],
  },
  {
    name: 'Weekend Study Club',
    description: 'Casual reviews on Saturday morning.',
    ownerEmail: 'jordan.groups@example.com',
    memberEmails: ['morgan.groups@example.com', DEMO_EMAIL],
  },
  {
    name: 'German Basics',
    description: 'Everyday words and short phrases.',
    ownerEmail: 'tom.groups@example.com',
    memberEmails: [
      DEMO_EMAIL,
      'emma.groups@example.com',
      'rita.groups@example.com',
      'dana.groups@example.com',
      'kate.groups@example.com',
      'liam.groups@example.com',
      'jordan.groups@example.com',
      'morgan.groups@example.com',
      'maria.groups@example.com',
      'sofia.groups@example.com',
      'alex.groups@example.com',
    ],
  },
  {
    name: 'Work Terms',
    description: 'Office vocabulary for meetings.',
    ownerEmail: 'pat.groups@example.com',
    memberEmails: [
      DEMO_EMAIL,
      'lisa.groups@example.com',
      'omar.groups@example.com',
    ],
  },
] as const;

async function upsertLayoutFixtureUser(
  prisma: PrismaClient,
  input: {
    email: string;
    displayName: string;
    passwordHash: string;
  },
) {
  const now = new Date();

  const user = await prisma.user.upsert({
    where: { email: input.email },
    create: {
      email: input.email,
      passwordHash: input.passwordHash,
      emailVerifiedAt: now,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      profile: {
        create: {
          displayName: input.displayName,
        },
      },
    },
    update: {
      blockedAt: null,
      deletedAt: null,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      displayName: input.displayName,
    },
    update: {
      displayName: input.displayName,
    },
  });

  return user;
}

async function ensureLayoutDemoGroups(
  prisma: PrismaClient,
  demoUserId: string,
) {
  const passwordHash = await argon2.hash(DEMO_PASSWORD);
  const usersByEmail = new Map<string, string>([[DEMO_EMAIL, demoUserId]]);

  for (const fixture of LAYOUT_FIXTURE_USERS) {
    const user = await upsertLayoutFixtureUser(prisma, {
      email: fixture.email,
      displayName: fixture.displayName,
      passwordHash,
    });
    usersByEmail.set(fixture.email, user.id);
  }

  for (const fixture of [...LAYOUT_GROUPS].reverse()) {
    const ownerId = usersByEmail.get(fixture.ownerEmail);

    if (!ownerId) {
      throw new Error(`Missing layout group owner ${fixture.ownerEmail}`);
    }

    let group = await prisma.group.findFirst({
      where: {
        name: fixture.name,
        createdById: ownerId,
        deletedAt: null,
      },
    });

    if (!group) {
      group = await prisma.group.create({
        data: {
          name: fixture.name,
          description: fixture.description,
          createdById: ownerId,
        },
      });
    } else {
      group = await prisma.group.update({
        where: { id: group.id },
        data: {
          description: fixture.description,
        },
      });
    }

    await prisma.groupMember.upsert({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId: ownerId,
        },
      },
      create: {
        groupId: group.id,
        userId: ownerId,
        role: 'OWNER',
      },
      update: {
        role: 'OWNER',
      },
    });

    for (const email of fixture.memberEmails) {
      const userId = usersByEmail.get(email);

      if (!userId || userId === ownerId) {
        continue;
      }

      await prisma.groupMember.upsert({
        where: {
          groupId_userId: {
            groupId: group.id,
            userId,
          },
        },
        create: {
          groupId: group.id,
          userId,
          role: 'MEMBER',
        },
        update: {},
      });
    }
  }
}

async function ensureDeckWithCards(
  prisma: PrismaClient,
  input: {
    ownerId: string;
    title: string;
    description: string;
    visibility: 'PRIVATE' | 'PUBLIC';
    moderationStatus: 'NONE' | 'APPROVED';
    isOfficial?: boolean;
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
  const officialData = {
    isOfficial: input.isOfficial ?? false,
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
        ...officialData,
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
        ...officialData,
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

    const catalogUser = await upsertCatalogUser(prisma);

    const groupDeck = await ensureDeckWithCards(prisma, {
      ownerId: catalogUser.id,
      title: GROUP_DECK_TITLE,
      description: 'Local-only private deck shared with the demo group.',
      visibility: 'PRIVATE',
      moderationStatus: 'NONE',
      targetLanguage: TARGET_LANGUAGE,
      sourceLanguage: SOURCE_LANGUAGE,
      cards: GROUP_DECK_CARDS,
    });

    await ensureSharedGroupDeck(prisma, {
      catalogUserId: catalogUser.id,
      demoUserId: user.id,
      deckId: groupDeck.id,
    });

    await ensureLayoutDemoGroups(prisma, user.id);

    const catalogPublicDeck = await ensureDeckWithCards(prisma, {
      ownerId: catalogUser.id,
      title: CATALOG_PUBLIC_DECK_TITLE,
      description: 'Local-only official public deck for the Public section.',
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
      isOfficial: true,
      targetLanguage: TARGET_LANGUAGE,
      sourceLanguage: SOURCE_LANGUAGE,
      cards: CATALOG_PUBLIC_CARDS,
    });

    console.log('Demo seed completed (local development only).');
    console.log(`Demo user email: ${DEMO_EMAIL}`);
    console.log(`Demo user password: ${DEMO_PASSWORD}`);
    console.log(`Private demo deck: ${privateDeck.title}`);
    console.log(`Public demo deck: ${publicDeck.title}`);
    console.log(
      `Queue decks: ${QUEUE_DECKS.map((deck) => deck.title).join(', ')}`,
    );
    console.log(`Group fixture: ${groupDeck.title}`);
    console.log(
      `Layout groups: ${LAYOUT_GROUPS.map((group) => group.name).join(', ')}`,
    );
    console.log(`Public catalog fixture: ${catalogPublicDeck.title}`);
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
