import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import { Deck } from '../../../decks/domain/types';
import { toDeck } from '../../../decks/infrastructure/mappers/deck.mapper';
import {
  CreateDeckGroupShareInput,
  DeckGroupShareRepositoryPort,
} from '../../application/ports/deck-group-share-repository.port';
import { DeckGroupShare } from '../../domain/types';
import { toDeckGroupShare } from '../mappers/deck-group-share.mapper';

@Injectable()
export class PrismaDeckGroupShareRepository implements DeckGroupShareRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateDeckGroupShareInput): Promise<DeckGroupShare> {
    const share = await this.prisma.deckGroupShare.create({
      data: {
        deckId: input.deckId,
        groupId: input.groupId,
        createdById: input.createdById,
      },
    });

    return toDeckGroupShare(share);
  }

  async findByDeckAndGroup(input: {
    deckId: string;
    groupId: string;
  }): Promise<DeckGroupShare | null> {
    const share = await this.prisma.deckGroupShare.findUnique({
      where: {
        deckId_groupId: {
          deckId: input.deckId,
          groupId: input.groupId,
        },
      },
    });

    return share ? toDeckGroupShare(share) : null;
  }

  async findActiveGroupsForDeck(deckId: string): Promise<DeckGroupShare[]> {
    const shares = await this.prisma.deckGroupShare.findMany({
      where: {
        deckId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return shares.map(toDeckGroupShare);
  }

  async findSharedDecksForGroup(groupId: string): Promise<Deck[]> {
    const shares = await this.prisma.deckGroupShare.findMany({
      where: {
        groupId,
        deletedAt: null,
        deck: {
          deletedAt: null,
        },
      },
      include: {
        deck: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return shares.map((share) => toDeck(share.deck));
  }

  async userHasAccessToDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<boolean> {
    const share = await this.prisma.deckGroupShare.findFirst({
      where: {
        deckId: input.deckId,
        deletedAt: null,
        deck: {
          deletedAt: null,
        },
        group: {
          deletedAt: null,
          members: {
            some: {
              userId: input.userId,
            },
          },
        },
      },
    });

    return share !== null;
  }
}
