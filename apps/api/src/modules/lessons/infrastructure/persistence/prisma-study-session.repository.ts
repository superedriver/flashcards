import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateStudySessionInput,
  CreateStudySessionReviewInput,
  StudySessionRepositoryPort,
} from '../../application/ports/study-session-repository.port';
import {
  ReviewAnswer,
  StudySession,
  StudySessionReview,
} from '../../domain/types';
import { toStudySessionReview } from '../mappers/study-session-review.mapper';
import { toStudySession } from '../mappers/study-session.mapper';

@Injectable()
export class PrismaStudySessionRepository implements StudySessionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async abandonActiveForUserAndDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<void> {
    await this.prisma.studySession.updateMany({
      where: {
        userId: input.userId,
        deckId: input.deckId,
        status: 'ACTIVE',
      },
      data: {
        status: 'ABANDONED',
        abandonedAt: new Date(),
      },
    });
  }

  async create(input: CreateStudySessionInput): Promise<StudySession> {
    const record = await this.prisma.studySession.create({
      data: {
        userId: input.userId,
        deckId: input.deckId,
        lessonSize: input.lessonSize,
      },
    });

    return toStudySession(record);
  }

  async findById(sessionId: string): Promise<StudySession | null> {
    const record = await this.prisma.studySession.findUnique({
      where: {
        id: sessionId,
      },
    });

    return record ? toStudySession(record) : null;
  }

  async createReview(
    input: CreateStudySessionReviewInput,
  ): Promise<StudySessionReview> {
    const record = await this.prisma.studySessionReview.create({
      data: {
        sessionId: input.sessionId,
        userId: input.userId,
        deckId: input.deckId,
        cardId: input.cardId,
        answer: input.answer,
        quality: input.quality,
        reviewedAt: input.reviewedAt,
        previousEaseFactor: input.previousEaseFactor ?? null,
        previousIntervalDays: input.previousIntervalDays ?? null,
        previousRepetitions: input.previousRepetitions ?? null,
        nextEaseFactor: input.nextEaseFactor,
        nextIntervalDays: input.nextIntervalDays,
        nextRepetitions: input.nextRepetitions,
        nextDueAt: input.nextDueAt,
      },
    });

    return toStudySessionReview(record);
  }

  async hasReviewForCard(input: {
    sessionId: string;
    cardId: string;
  }): Promise<boolean> {
    const count = await this.prisma.studySessionReview.count({
      where: {
        sessionId: input.sessionId,
        cardId: input.cardId,
      },
    });

    return count > 0;
  }

  async countReviews(sessionId: string): Promise<number> {
    return this.prisma.studySessionReview.count({
      where: {
        sessionId,
      },
    });
  }

  async countReviewsByAnswer(input: {
    sessionId: string;
    answer: ReviewAnswer;
  }): Promise<number> {
    return this.prisma.studySessionReview.count({
      where: {
        sessionId: input.sessionId,
        answer: input.answer,
      },
    });
  }

  async complete(sessionId: string, completedAt: Date): Promise<StudySession> {
    const record = await this.prisma.studySession.update({
      where: {
        id: sessionId,
      },
      data: {
        status: 'COMPLETED',
        completedAt,
      },
    });

    return toStudySession(record);
  }

  async abandon(sessionId: string, abandonedAt: Date): Promise<StudySession> {
    const record = await this.prisma.studySession.update({
      where: {
        id: sessionId,
      },
      data: {
        status: 'ABANDONED',
        abandonedAt,
      },
    });

    return toStudySession(record);
  }
}
