import { toCardReviewState } from './card-review-state.mapper';

const prismaRecord = {
  id: 'review-1',
  userId: 'user-1',
  cardId: 'card-1',
  learningStep: 3,
  longReviewSuccessCount: 1,
  dueAt: new Date('2026-06-02T00:00:00.000Z'),
  lastReviewedAt: new Date('2026-05-30T00:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

describe('card-review-state.mapper', () => {
  it('toCardReviewState maps all fields', () => {
    expect(toCardReviewState(prismaRecord)).toEqual({
      id: 'review-1',
      userId: 'user-1',
      cardId: 'card-1',
      learningStep: 3,
      longReviewSuccessCount: 1,
      dueAt: prismaRecord.dueAt,
      lastReviewedAt: prismaRecord.lastReviewedAt,
      createdAt: prismaRecord.createdAt,
      updatedAt: prismaRecord.updatedAt,
    });
  });
});
