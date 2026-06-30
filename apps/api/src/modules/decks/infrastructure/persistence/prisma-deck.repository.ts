import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateDeckInput,
  UpdateDeckInput,
} from '../../application/ports/deck-repository.port';
import { Deck } from '../../domain/types';
import { toDeck } from '../mappers/deck.mapper';

@Injectable()
export class PrismaDeckRepository {
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
}
