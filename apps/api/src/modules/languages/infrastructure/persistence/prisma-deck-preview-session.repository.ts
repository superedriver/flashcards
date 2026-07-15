import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateDeckPreviewSessionInput,
  DeckPreviewSessionRepositoryPort,
  UpdateDeckPreviewSessionCardsInput,
  UpdateDeckPreviewSessionStatusInput,
} from '../../application/ports/deck-preview-session-repository.port';
import { DeckPreviewSession } from '../../domain/types';
import {
  toDeckPreviewSession,
  toDeckPreviewSessionCardsJson,
} from '../mappers/deck-preview-session.mapper';

@Injectable()
export class PrismaDeckPreviewSessionRepository implements DeckPreviewSessionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    input: CreateDeckPreviewSessionInput,
  ): Promise<DeckPreviewSession> {
    const session = await this.prisma.deckPreviewSession.create({
      data: {
        userId: input.userId,
        type: input.type,
        sourceDeckId: input.sourceDeckId ?? null,
        targetLanguage: input.targetLanguage,
        chosenSourceLanguage: input.chosenSourceLanguage,
        cards: toDeckPreviewSessionCardsJson(input.cards),
        expiresAt: input.expiresAt,
      },
    });

    return toDeckPreviewSession(session);
  }

  async findById(sessionId: string): Promise<DeckPreviewSession | null> {
    const session = await this.prisma.deckPreviewSession.findUnique({
      where: { id: sessionId },
    });

    return session ? toDeckPreviewSession(session) : null;
  }

  async findActiveByUserId(
    userId: string,
    now: Date,
  ): Promise<DeckPreviewSession | null> {
    const session = await this.prisma.deckPreviewSession.findFirst({
      where: {
        userId,
        status: { not: 'EXPIRED' },
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    return session ? toDeckPreviewSession(session) : null;
  }

  async updateCards(
    input: UpdateDeckPreviewSessionCardsInput,
  ): Promise<DeckPreviewSession> {
    const session = await this.prisma.deckPreviewSession.update({
      where: { id: input.sessionId },
      data: {
        cards: toDeckPreviewSessionCardsJson(input.cards),
      },
    });

    return toDeckPreviewSession(session);
  }

  async updateStatus(
    input: UpdateDeckPreviewSessionStatusInput,
  ): Promise<DeckPreviewSession> {
    const session = await this.prisma.deckPreviewSession.update({
      where: { id: input.sessionId },
      data: {
        status: input.status,
      },
    });

    return toDeckPreviewSession(session);
  }

  async delete(sessionId: string): Promise<void> {
    await this.prisma.deckPreviewSession.delete({
      where: { id: sessionId },
    });
  }

  async deleteExpiredSessions(now: Date): Promise<number> {
    const result = await this.prisma.deckPreviewSession.deleteMany({
      where: {
        OR: [{ status: 'EXPIRED' }, { expiresAt: { lte: now } }],
      },
    });

    return result.count;
  }
}
