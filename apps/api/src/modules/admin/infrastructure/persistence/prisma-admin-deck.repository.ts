import { Injectable } from '@nestjs/common';
import { DeckModerationStatus } from '../../../decks/domain/types';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  AdminDeckRepositoryPort,
  ModerationQueueInput,
  ModerationQueueResult,
} from '../../application/ports/admin-deck-repository.port';
import { ModerationDeck } from '../../domain/types';
import { toModerationDeck } from '../mappers/moderation-deck.mapper';

const MAX_LIMIT = 50;
const MIN_OFFSET = 0;

const moderationDeckInclude = {
  owner: {
    select: {
      email: true,
    },
  },
  _count: {
    select: {
      cards: {
        where: {
          deletedAt: null,
        },
      },
    },
  },
} as const;

@Injectable()
export class PrismaAdminDeckRepository implements AdminDeckRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async moderationQueue(
    input: ModerationQueueInput,
  ): Promise<ModerationQueueResult> {
    const limit = Math.min(MAX_LIMIT, input.limit);
    const offset = Math.max(MIN_OFFSET, input.offset);
    const where = {
      deletedAt: null,
      ...(input.status ? { moderationStatus: input.status } : {}),
    };

    const [decks, total] = await Promise.all([
      this.prisma.deck.findMany({
        where,
        include: moderationDeckInclude,
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.deck.count({ where }),
    ]);

    return {
      items: decks.map(toModerationDeck),
      total,
    };
  }

  async setModerationStatus(input: {
    deckId: string;
    status: DeckModerationStatus;
  }): Promise<ModerationDeck> {
    const deck = await this.prisma.deck.update({
      where: {
        id: input.deckId,
        deletedAt: null,
      },
      data: {
        moderationStatus: input.status,
      },
      include: moderationDeckInclude,
    });

    return toModerationDeck(deck);
  }

  async setOfficial(input: {
    deckId: string;
    isOfficial: boolean;
  }): Promise<ModerationDeck> {
    const deck = await this.prisma.deck.update({
      where: {
        id: input.deckId,
        deletedAt: null,
      },
      data: {
        isOfficial: input.isOfficial,
      },
      include: moderationDeckInclude,
    });

    return toModerationDeck(deck);
  }
}
