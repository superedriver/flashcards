import { toStudySessionReview } from './study-session-review.mapper';

const prismaRecord = {
  id: 'session-review-1',
  sessionId: 'session-1',
  userId: 'user-1',
  deckId: 'deck-1',
  cardId: 'card-1',
  answer: 'KNOW',
  reviewedAt: new Date('2026-06-01T12:00:00.000Z'),
  previousLearningStep: 2,
  previousLongReviewSuccessCount: 0,
  nextLearningStep: 3,
  nextLongReviewSuccessCount: 0,
  nextDueAt: new Date('2026-06-02T00:00:00.000Z'),
  createdAt: new Date('2026-06-01T12:00:00.000Z'),
};

describe('study-session-review.mapper', () => {
  it('toStudySessionReview maps answer and learning-step before/after fields', () => {
    expect(toStudySessionReview(prismaRecord)).toEqual({
      id: 'session-review-1',
      sessionId: 'session-1',
      userId: 'user-1',
      deckId: 'deck-1',
      cardId: 'card-1',
      answer: 'KNOW',
      reviewedAt: prismaRecord.reviewedAt,
      previousLearningStep: 2,
      previousLongReviewSuccessCount: 0,
      nextLearningStep: 3,
      nextLongReviewSuccessCount: 0,
      nextDueAt: prismaRecord.nextDueAt,
      createdAt: prismaRecord.createdAt,
    });
  });

  it('toStudySessionReview casts answer to domain enum', () => {
    const mapped = toStudySessionReview({
      ...prismaRecord,
      answer: 'DONT_KNOW',
      previousLearningStep: null,
      previousLongReviewSuccessCount: null,
    });

    expect(mapped.answer).toBe('DONT_KNOW');
    expect(mapped.previousLearningStep).toBeNull();
    expect(mapped.previousLongReviewSuccessCount).toBeNull();
  });
});
