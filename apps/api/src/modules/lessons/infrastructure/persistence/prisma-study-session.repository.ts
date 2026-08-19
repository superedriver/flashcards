import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateStudySessionInput,
  CreateStudySessionReviewInput,
  StudySessionRepositoryPort,
  UpdateStudySessionInput,
} from '../../application/ports/study-session-repository.port';
import {
  LessonQueueState,
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

  async abandonActiveForUser(input: { userId: string }): Promise<void> {
    await this.prisma.studySession.updateMany({
      where: {
        userId: input.userId,
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
        scope: input.scope,
        lessonSize: input.lessonSize,
        snapshotCardIds: input.snapshotCardIds ?? [],
        queueState: toPrismaQueueState(input.queueState),
      },
    });

    return toStudySession(record);
  }

  async update(input: UpdateStudySessionInput): Promise<StudySession> {
    const record = await this.prisma.studySession.update({
      where: {
        id: input.sessionId,
      },
      data: {
        ...(input.snapshotCardIds !== undefined && {
          snapshotCardIds: input.snapshotCardIds,
        }),
        ...(input.queueState !== undefined && {
          queueState: toPrismaQueueState(input.queueState),
        }),
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
        reviewedAt: input.reviewedAt,
        previousLearningStep: input.previousLearningStep,
        previousLongReviewSuccessCount: input.previousLongReviewSuccessCount,
        nextLearningStep: input.nextLearningStep,
        nextLongReviewSuccessCount: input.nextLongReviewSuccessCount,
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

function toPrismaQueueState(
  queueState: LessonQueueState | null | undefined,
): LessonQueueState | typeof Prisma.DbNull | undefined {
  if (queueState === undefined) {
    return undefined;
  }

  if (queueState === null) {
    return Prisma.DbNull;
  }

  return queueState;
}
