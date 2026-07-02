import { toStudySessionReview } from './study-session-review.mapper';

const prismaRecord = {
  id: 'session-review-1',
  sessionId: 'session-1',
  userId: 'user-1',
  deckId: 'deck-1',
  cardId: 'card-1',
  answer: 'KNOW',
  quality: 4,
  reviewedAt: new Date('2026-06-01T12:00:00.000Z'),
  previousEaseFactor: 2.3,
  previousIntervalDays: 1,
  previousRepetitions: 0,
  nextEaseFactor: 2.5,
  nextIntervalDays: 1,
  nextRepetitions: 1,
  nextDueAt: new Date('2026-06-02T00:00:00.000Z'),
  createdAt: new Date('2026-06-01T12:00:00.000Z'),
};

describe('study-session-review.mapper', () => {
  it('toStudySessionReview maps answer and SRS before/after fields', () => {
    expect(toStudySessionReview(prismaRecord)).toEqual({
      id: 'session-review-1',
      sessionId: 'session-1',
      userId: 'user-1',
      deckId: 'deck-1',
      cardId: 'card-1',
      answer: 'KNOW',
      quality: 4,
      reviewedAt: prismaRecord.reviewedAt,
      previousEaseFactor: 2.3,
      previousIntervalDays: 1,
      previousRepetitions: 0,
      nextEaseFactor: 2.5,
      nextIntervalDays: 1,
      nextRepetitions: 1,
      nextDueAt: prismaRecord.nextDueAt,
      createdAt: prismaRecord.createdAt,
    });
  });

  it('toStudySessionReview casts answer to domain enum', () => {
    const mapped = toStudySessionReview({
      ...prismaRecord,
      answer: 'DONT_KNOW',
      quality: 1,
    });

    expect(mapped.answer).toBe('DONT_KNOW');
    expect(mapped.quality).toBe(1);
  });
});
