import {
  LessonQueueState,
  ReviewAnswer,
  StudySession,
  StudySessionReview,
  StudySessionScope,
} from '../../domain/types';

export const STUDY_SESSION_REPOSITORY = Symbol('STUDY_SESSION_REPOSITORY');

export type CreateStudySessionInput = {
  userId: string;
  deckId: string | null;
  scope: StudySessionScope;
  lessonSize: number;
  snapshotCardIds?: string[];
  queueState?: LessonQueueState | null;
};

export type UpdateStudySessionInput = {
  sessionId: string;
  snapshotCardIds?: string[];
  queueState?: LessonQueueState | null;
};

export type CreateStudySessionReviewInput = {
  sessionId: string;
  userId: string;
  deckId: string;
  cardId: string;
  answer: ReviewAnswer;
  reviewedAt: Date;
  previousLearningStep: number | null;
  previousLongReviewSuccessCount: number | null;
  nextLearningStep: number;
  nextLongReviewSuccessCount: number;
  nextDueAt: Date;
};

export type StudySessionRepositoryPort = {
  abandonActiveForUserAndDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<void>;
  abandonActiveForUser(input: { userId: string }): Promise<void>;
  create(input: CreateStudySessionInput): Promise<StudySession>;
  update(input: UpdateStudySessionInput): Promise<StudySession>;
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
  abandon(sessionId: string, abandonedAt: Date): Promise<StudySession>;
};
