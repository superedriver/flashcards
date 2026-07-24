import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CardReviewStateRepositoryPort,
  LearningGroupCounts,
  UpsertCardReviewStateInput,
} from '../../application/ports/card-review-state-repository.port';
import { CardReviewState } from '../../domain/types';
import { toCardReviewState } from '../mappers/card-review-state.mapper';

const activeCardWhere = {
  deletedAt: null,
  deck: {
    deletedAt: null,
  },
} as const;

const emptyLearningGroupCounts: LearningGroupCounts = {
  toLearnCount: 0,
  practicedCount: 0,
  learnedCount: 0,
};

function toLearningGroupCounts(
  rows: Array<{ learningStep: number; _count: { _all: number } }>,
): LearningGroupCounts {
  const counts = { ...emptyLearningGroupCounts };

  for (const row of rows) {
    const count = row._count._all;
    if (row.learningStep <= 1) {
      counts.toLearnCount += count;
    } else if (row.learningStep <= 6) {
      counts.practicedCount += count;
    } else {
      counts.learnedCount += count;
    }
  }

  return counts;
}

@Injectable()
export class PrismaCardReviewStateRepository implements CardReviewStateRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndCard(
    userId: string,
    cardId: string,
  ): Promise<CardReviewState | null> {
    const record = await this.prisma.cardReviewState.findFirst({
      where: {
        userId,
        cardId,
      },
    });

    return record ? toCardReviewState(record) : null;
  }

  async findDueCardIdsForDeck(input: {
    userId: string;
    deckId: string;
    now: Date;
    limit: number;
  }): Promise<string[]> {
    const records = await this.prisma.cardReviewState.findMany({
      where: {
        userId: input.userId,
        dueAt: {
          lte: input.now,
        },
        card: {
          deckId: input.deckId,
          ...activeCardWhere,
        },
      },
      orderBy: {
        dueAt: 'asc',
      },
      take: input.limit,
      select: {
        cardId: true,
      },
    });

    return records.map((record) => record.cardId);
  }

  async findDueCardIdsForOwnDecksWithTargetLanguage(input: {
    userId: string;
    targetLanguage: string;
    now: Date;
    limit: number;
  }): Promise<string[]> {
    const records = await this.prisma.cardReviewState.findMany({
      where: {
        userId: input.userId,
        dueAt: {
          lte: input.now,
        },
        card: {
          deletedAt: null,
          deck: {
            deletedAt: null,
            ownerId: input.userId,
            targetLanguage: input.targetLanguage,
          },
        },
      },
      orderBy: {
        dueAt: 'asc',
      },
      take: input.limit,
      select: {
        cardId: true,
      },
    });

    return records.map((record) => record.cardId);
  }

  async countReviewedForDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<number> {
    return this.prisma.cardReviewState.count({
      where: {
        userId: input.userId,
        card: {
          deckId: input.deckId,
          ...activeCardWhere,
        },
      },
    });
  }

  async countDueForDeck(input: {
    userId: string;
    deckId: string;
    now: Date;
  }): Promise<number> {
    return this.prisma.cardReviewState.count({
      where: {
        userId: input.userId,
        dueAt: {
          lte: input.now,
        },
        card: {
          deckId: input.deckId,
          ...activeCardWhere,
        },
      },
    });
  }

  async countDueForUser(input: { userId: string; now: Date }): Promise<number> {
    return this.prisma.cardReviewState.count({
      where: {
        userId: input.userId,
        dueAt: {
          lte: input.now,
        },
        card: activeCardWhere,
      },
    });
  }

  async countDueForOwnDecksWithTargetLanguage(input: {
    userId: string;
    targetLanguage: string;
    now: Date;
  }): Promise<number> {
    return this.prisma.cardReviewState.count({
      where: {
        userId: input.userId,
        dueAt: {
          lte: input.now,
        },
        card: {
          deletedAt: null,
          deck: {
            deletedAt: null,
            ownerId: input.userId,
            targetLanguage: input.targetLanguage,
          },
        },
      },
    });
  }

  async countLearningGroupsForDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<LearningGroupCounts> {
    const rows = await this.prisma.cardReviewState.groupBy({
      by: ['learningStep'],
      where: {
        userId: input.userId,
        card: {
          deckId: input.deckId,
          ...activeCardWhere,
        },
      },
      _count: {
        _all: true,
      },
    });

    return toLearningGroupCounts(rows);
  }

  async countLearningGroupsForOwnDecksWithTargetLanguage(input: {
    userId: string;
    targetLanguage: string;
  }): Promise<LearningGroupCounts> {
    const rows = await this.prisma.cardReviewState.groupBy({
      by: ['learningStep'],
      where: {
        userId: input.userId,
        card: {
          deletedAt: null,
          deck: {
            deletedAt: null,
            ownerId: input.userId,
            targetLanguage: input.targetLanguage,
          },
        },
      },
      _count: {
        _all: true,
      },
    });

    return toLearningGroupCounts(rows);
  }

  async findNextDueAtForDeck(input: {
    userId: string;
    deckId: string;
    now: Date;
  }): Promise<Date | null> {
    const record = await this.prisma.cardReviewState.findFirst({
      where: {
        userId: input.userId,
        dueAt: {
          gt: input.now,
        },
        card: {
          deckId: input.deckId,
          ...activeCardWhere,
        },
      },
      orderBy: {
        dueAt: 'asc',
      },
      select: {
        dueAt: true,
      },
    });

    return record?.dueAt ?? null;
  }

  async createInitialIfMissing(input: {
    userId: string;
    cardId: string;
    now?: Date;
  }): Promise<CardReviewState> {
    const existing = await this.findByUserAndCard(input.userId, input.cardId);
    if (existing) {
      return existing;
    }

    const dueAt = input.now ?? new Date();

    try {
      const record = await this.prisma.cardReviewState.create({
        data: {
          userId: input.userId,
          cardId: input.cardId,
          learningStep: 0,
          longReviewSuccessCount: 0,
          dueAt,
        },
      });

      return toCardReviewState(record);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const raced = await this.findByUserAndCard(input.userId, input.cardId);
        if (raced) {
          return raced;
        }
      }

      throw error;
    }
  }

  async createInitialMany(input: {
    userId: string;
    cardIds: string[];
    now?: Date;
  }): Promise<void> {
    if (input.cardIds.length === 0) {
      return;
    }

    const dueAt = input.now ?? new Date();

    await this.prisma.cardReviewState.createMany({
      data: input.cardIds.map((cardId) => ({
        userId: input.userId,
        cardId,
        learningStep: 0,
        longReviewSuccessCount: 0,
        dueAt,
      })),
      skipDuplicates: true,
    });
  }

  async upsert(input: UpsertCardReviewStateInput): Promise<CardReviewState> {
    const record = await this.prisma.cardReviewState.upsert({
      where: {
        userId_cardId: {
          userId: input.userId,
          cardId: input.cardId,
        },
      },
      create: {
        userId: input.userId,
        cardId: input.cardId,
        learningStep: input.learningStep,
        longReviewSuccessCount: input.longReviewSuccessCount,
        dueAt: input.dueAt,
        lastReviewedAt: input.lastReviewedAt,
      },
      update: {
        learningStep: input.learningStep,
        longReviewSuccessCount: input.longReviewSuccessCount,
        dueAt: input.dueAt,
        lastReviewedAt: input.lastReviewedAt,
      },
    });

    return toCardReviewState(record);
  }
}
