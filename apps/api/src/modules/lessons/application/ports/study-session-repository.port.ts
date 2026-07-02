import {
  ReviewAnswer,
  StudySession,
  StudySessionReview,
} from '../../domain/types';

export const STUDY_SESSION_REPOSITORY = Symbol('STUDY_SESSION_REPOSITORY');

export type CreateStudySessionInput = {
  userId: string;
  deckId: string;
  lessonSize: number;
};

export type CreateStudySessionReviewInput = {
  sessionId: string;
  userId: string;
  deckId: string;
  cardId: string;
  answer: ReviewAnswer;
  quality: number;
  reviewedAt: Date;
  previousEaseFactor?: number | null;
  previousIntervalDays?: number | null;
  previousRepetitions?: number | null;
  nextEaseFactor: number;
  nextIntervalDays: number;
  nextRepetitions: number;
  nextDueAt: Date;
};

export type StudySessionRepositoryPort = {
  abandonActiveForUserAndDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<void>;
  create(input: CreateStudySessionInput): Promise<StudySession>;
  findById(sessionId: string): Promise<StudySession | null>;
  createReview(
    input: CreateStudySessionReviewInput,
  ): Promise<StudySessionReview>;
  hasReviewForCard(input: {
    sessionId: string;
    cardId: string;
  }): Promise<boolean>;
  countReviews(sessionId: string): Promise<number>;
  countReviewsByAnswer(input: {
    sessionId: string;
    answer: ReviewAnswer;
  }): Promise<number>;
  complete(sessionId: string, completedAt: Date): Promise<StudySession>;
};
