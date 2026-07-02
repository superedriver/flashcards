import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CardReviewStateRepositoryPort,
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
        easeFactor: input.easeFactor,
        intervalDays: input.intervalDays,
        repetitions: input.repetitions,
        dueAt: input.dueAt,
        lastReviewedAt: input.lastReviewedAt,
      },
      update: {
        easeFactor: input.easeFactor,
        intervalDays: input.intervalDays,
        repetitions: input.repetitions,
        dueAt: input.dueAt,
        lastReviewedAt: input.lastReviewedAt,
      },
    });

    return toCardReviewState(record);
  }
}
