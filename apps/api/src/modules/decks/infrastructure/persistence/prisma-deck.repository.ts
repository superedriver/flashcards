import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateCopiedDeckInput,
  CreateDeckInput,
  DeckRepositoryPort,
  PublishDeckInput,
  PublicDeckSearchInput,
  PublicDeckSearchResult,
  UnpublishDeckInput,
  UpdateDeckInput,
} from '../../application/ports/deck-repository.port';
import { Deck } from '../../domain/types';
import { toDeck } from '../mappers/deck.mapper';

const PUBLIC_APPROVED_LIMIT_MAX = 50;

@Injectable()
export class PrismaDeckRepository implements DeckRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateDeckInput): Promise<Deck> {
    const deck = await this.prisma.deck.create({
      data: {
        ownerId: input.ownerId,
        title: input.title,
        description: input.description ?? null,
      },
    });

    return toDeck(deck);
  }

  async findById(deckId: string): Promise<Deck | null> {
    const deck = await this.prisma.deck.findFirst({
      where: {
        id: deckId,
        deletedAt: null,
      },
    });

    return deck ? toDeck(deck) : null;
  }

  async findByOwner(ownerId: string): Promise<Deck[]> {
    const decks = await this.prisma.deck.findMany({
      where: {
        ownerId,
        deletedAt: null,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return decks.map(toDeck);
  }

  async update(input: UpdateDeckInput): Promise<Deck> {
    const data: {
      title?: string;
      description?: string | null;
    } = {};

    if (input.title !== undefined) {
      data.title = input.title;
    }

    if (input.description !== undefined) {
      data.description = input.description;
    }

    const deck = await this.prisma.deck.update({
      where: {
        id: input.deckId,
        deletedAt: null,
      },
      data,
    });

    return toDeck(deck);
  }

  async softDelete(deckId: string): Promise<void> {
    await this.prisma.deck.update({
      where: { id: deckId },
      data: { deletedAt: new Date() },
    });
  }

  async publish(input: PublishDeckInput): Promise<Deck> {
    const deck = await this.prisma.deck.update({
      where: {
        id: input.deckId,
        deletedAt: null,
      },
      data: {
        visibility: 'PUBLIC',
        moderationStatus: 'APPROVED',
      },
    });

    return toDeck(deck);
  }

  async unpublish(input: UnpublishDeckInput): Promise<Deck> {
    const deck = await this.prisma.deck.update({
      where: {
        id: input.deckId,
        deletedAt: null,
      },
      data: {
        visibility: 'PRIVATE',
        moderationStatus: 'NONE',
      },
    });

    return toDeck(deck);
  }

  async findPublicApprovedById(deckId: string): Promise<Deck | null> {
    const deck = await this.prisma.deck.findFirst({
      where: {
        id: deckId,
        visibility: 'PUBLIC',
        moderationStatus: 'APPROVED',
        deletedAt: null,
      },
    });

    return deck ? toDeck(deck) : null;
  }

  async searchPublicApproved(
    input: PublicDeckSearchInput,
  ): Promise<PublicDeckSearchResult> {
    const limit = Math.min(input.limit, PUBLIC_APPROVED_LIMIT_MAX);
    const query = input.query?.trim() ?? '';

    const where = {
      visibility: 'PUBLIC' as const,
      moderationStatus: 'APPROVED' as const,
      deletedAt: null,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' as const } },
              {
                description: { contains: query, mode: 'insensitive' as const },
              },
            ],
          }
        : {}),
    };

    const [decks, total] = await Promise.all([
      this.prisma.deck.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: input.offset,
      }),
      this.prisma.deck.count({ where }),
    ]);

    return {
      items: decks.map(toDeck),
      total,
    };
  }

  async createCopiedDeck(input: CreateCopiedDeckInput): Promise<Deck> {
    const deck = await this.prisma.deck.create({
      data: {
        ownerId: input.ownerId,
        sourceDeckId: input.sourceDeckId,
        title: input.title,
        description: input.description ?? null,
        visibility: 'PRIVATE',
        moderationStatus: 'NONE',
        isOfficial: false,
      },
    });

    return toDeck(deck);
  }
}
