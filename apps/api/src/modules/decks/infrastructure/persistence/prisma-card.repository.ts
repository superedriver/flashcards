import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CardRepositoryPort,
  CreateCardInput,
  CreateManyCardsInput,
  FindLiveDuplicatesForOwnerInput,
  LiveDuplicateCard,
  UpdateCardInput,
} from '../../application/ports/card-repository.port';
import { Card } from '../../domain/types';
import { normalizeCardPair } from '../../domain/services/normalize-card-pair';
import { toCard } from '../mappers/card.mapper';

@Injectable()
export class PrismaCardRepository implements CardRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCardInput): Promise<Card> {
    const card = await this.prisma.card.create({
      data: {
        deckId: input.deckId,
        front: input.front,
        back: input.back,
        example: input.example ?? null,
        notes: input.notes ?? null,
        position: input.position ?? 0,
      },
    });

    return toCard(card);
  }

  async findById(cardId: string): Promise<Card | null> {
    const card = await this.prisma.card.findFirst({
      where: {
        id: cardId,
        deletedAt: null,
      },
    });

    return card ? toCard(card) : null;
  }

  async findByDeckId(deckId: string): Promise<Card[]> {
    const cards = await this.prisma.card.findMany({
      where: {
        deckId,
        deletedAt: null,
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });

    return cards.map(toCard);
  }

  async findLiveDuplicatesForOwner(
    input: FindLiveDuplicatesForOwnerInput,
  ): Promise<LiveDuplicateCard[]> {
    if (input.pairs.length === 0) {
      return [];
    }

    const wantedKeys = new Set(
      input.pairs.map((pair) => {
        const normalized = normalizeCardPair(pair.front, pair.back);
        return `${normalized.front}\0${normalized.back}`;
      }),
    );

    const cards = await this.prisma.card.findMany({
      select: {
        back: true,
        deck: {
          select: {
            title: true,
          },
        },
        deckId: true,
        front: true,
        id: true,
      },
      where: {
        deletedAt: null,
        deck: {
          deletedAt: null,
          ownerId: input.ownerId,
        },
      },
    });

    return cards
      .filter((card) => {
        const normalized = normalizeCardPair(card.front, card.back);
        return wantedKeys.has(`${normalized.front}\0${normalized.back}`);
      })
      .map((card) => ({
        back: card.back,
        deckId: card.deckId,
        deckTitle: card.deck.title,
        front: card.front,
        id: card.id,
      }));
  }

  async update(input: UpdateCardInput): Promise<Card> {
    const data: {
      front?: string;
      back?: string;
      example?: string | null;
      notes?: string | null;
      position?: number;
    } = {};

    if (input.front !== undefined) {
      data.front = input.front;
    }

    if (input.back !== undefined) {
      data.back = input.back;
    }

    if (input.example !== undefined) {
      data.example = input.example;
    }

    if (input.notes !== undefined) {
      data.notes = input.notes;
    }

    if (input.position !== undefined) {
      data.position = input.position;
    }

    const card = await this.prisma.card.update({
      where: {
        id: input.cardId,
        deletedAt: null,
      },
      data,
    });

    return toCard(card);
  }

  async softDelete(cardId: string): Promise<void> {
    await this.prisma.card.update({
      where: { id: cardId },
      data: { deletedAt: new Date() },
    });
  }

  async softDeleteByDeckId(deckId: string): Promise<void> {
    await this.prisma.card.updateMany({
      where: {
        deckId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  async countByDeckId(deckId: string): Promise<number> {
    return this.prisma.card.count({
      where: {
        deckId,
        deletedAt: null,
      },
    });
  }

  async createMany(input: CreateManyCardsInput): Promise<Card[]> {
    if (input.cards.length === 0) {
      return [];
    }

    const cards = await this.prisma.card.createManyAndReturn({
      data: input.cards.map((card) => ({
        deckId: card.deckId,
        front: card.front,
        back: card.back,
        example: card.example ?? null,
        notes: card.notes ?? null,
        position: card.position,
      })),
    });

    return cards.map(toCard);
  }
}
