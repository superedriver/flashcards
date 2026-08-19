import {
  createLessonQueueState,
  LessonQueueCandidate,
  LessonQueueState,
  recordLessonCardAnswer,
  selectNextLessonCard,
} from './select-next-lesson-card';

const t0 = new Date('2026-08-19T10:00:00.000Z');
const t1 = new Date('2026-08-19T10:01:00.000Z');
const t2 = new Date('2026-08-19T10:02:00.000Z');
const createdEarly = new Date('2026-01-01T00:00:00.000Z');
const createdLate = new Date('2026-06-01T00:00:00.000Z');

function card(
  cardId: string,
  dueAt: Date,
  createdAt: Date = createdEarly,
): LessonQueueCandidate {
  return { cardId, dueAt, createdAt };
}

function answer(
  state: LessonQueueState,
  cardId: string,
  candidates: LessonQueueCandidate[],
): LessonQueueState {
  return recordLessonCardAnswer({
    state,
    answeredCardId: cardId,
    candidates,
  });
}

describe('selectNextLessonCard', () => {
  it('returns null when there are no eligible candidates', () => {
    const state = createLessonQueueState({ scope: 'DECK' });

    expect(selectNextLessonCard({ state, candidates: [] })).toBeNull();
  });

  it('excludes Home candidates that are not in the snapshot', () => {
    const state = createLessonQueueState({
      scope: 'HOME_ACTIVE_TARGET',
      snapshotCardIds: ['a'],
    });
    const candidates = [card('a', t0), card('outside', t0)];

    expect(selectNextLessonCard({ state, candidates })).toBe('a');
  });

  it('allows a new Deck primary that was not in any snapshot', () => {
    const state = createLessonQueueState({ scope: 'DECK' });
    const candidates = [card('new-live', t0)];

    expect(selectNextLessonCard({ state, candidates })).toBe('new-live');
  });

  it('picks the next primary by dueAt, then createdAt, then cardId', () => {
    const state = createLessonQueueState({ scope: 'DECK' });
    const candidates = [
      card('c', t0, createdLate),
      card('b', t0, createdEarly),
      card('a', t1, createdEarly),
    ];

    expect(selectNextLessonCard({ state, candidates })).toBe('b');
  });

  it('breaks primary ties with cardId when dueAt and createdAt match', () => {
    const state = createLessonQueueState({ scope: 'DECK' });
    const candidates = [
      card('m', t0, createdEarly),
      card('k', t0, createdEarly),
    ];

    expect(selectNextLessonCard({ state, candidates })).toBe('k');
  });

  it('excludes a card after 3 answers even if it is still ready', () => {
    let state = createLessonQueueState({ scope: 'DECK' });
    const onlyA = [card('a', t0)];

    state = answer(state, 'a', []);
    state = answer(state, 'a', []);
    state = answer(state, 'a', []);

    expect(selectNextLessonCard({ state, candidates: onlyA })).toBeNull();
  });

  it('does not pick a repeat until 3 other answers fill the frozen gap', () => {
    let state = createLessonQueueState({ scope: 'DECK' });
    const ready = [
      card('a', t0),
      card('b', t1),
      card('c', t1),
      card('d', t1),
      card('e', t2),
    ];

    expect(selectNextLessonCard({ state, candidates: ready })).toBe('a');

    state = answer(
      state,
      'a',
      ready.filter((item) => item.cardId !== 'a'),
    );

    expect(state.pendingRepeats.a).toEqual({ targetGap: 3, filled: 0 });
    expect(selectNextLessonCard({ state, candidates: ready })).toBe('b');

    state = answer(state, 'b', ready);
    expect(state.pendingRepeats.a?.filled).toBe(1);
    expect(selectNextLessonCard({ state, candidates: ready })).toBe('c');

    state = answer(state, 'c', ready);
    expect(selectNextLessonCard({ state, candidates: ready })).toBe('d');

    state = answer(state, 'd', ready);

    expect(state.pendingRepeats.a?.filled).toBe(3);
    expect(selectNextLessonCard({ state, candidates: ready })).toBe('a');
  });

  it('freezes N from late-due cards that are ready at answer time', () => {
    let state = createLessonQueueState({ scope: 'DECK' });
    const displayTime = [card('a', t0), card('b', t0)];
    const answerTime = [card('b', t0), card('c', t0), card('d', t0)];
    const afterAnswer = [
      card('a', t0),
      card('b', t0),
      card('c', t0),
      card('d', t0),
    ];

    expect(selectNextLessonCard({ state, candidates: displayTime })).toBe('a');

    state = answer(state, 'a', answerTime);

    expect(state.showCounts.a).toBe(1);
    expect(state.pendingRepeats.a).toEqual({ targetGap: 3, filled: 0 });
    expect(selectNextLessonCard({ state, candidates: afterAnswer })).toBe('b');

    state = answer(state, 'b', afterAnswer);
    expect(selectNextLessonCard({ state, candidates: afterAnswer })).toBe('c');

    state = answer(state, 'c', afterAnswer);
    expect(selectNextLessonCard({ state, candidates: afterAnswer })).toBe('d');

    state = answer(state, 'd', afterAnswer);
    expect(selectNextLessonCard({ state, candidates: afterAnswer })).toBe('a');
  });

  it('does not grow N when cards become ready after the answer freeze', () => {
    let state = createLessonQueueState({ scope: 'DECK' });

    state = answer(state, 'a', [card('b', t0)]);

    expect(state.pendingRepeats.a).toEqual({ targetGap: 1, filled: 0 });

    const laterReady = [
      card('a', t0),
      card('b', t0),
      card('c', t0),
      card('d', t0),
    ];

    expect(selectNextLessonCard({ state, candidates: laterReady })).toBe('b');

    state = answer(state, 'b', laterReady);

    expect(state.pendingRepeats.a?.targetGap).toBe(1);
    expect(state.pendingRepeats.a?.filled).toBe(1);
    expect(selectNextLessonCard({ state, candidates: laterReady })).toBe('a');
  });

  it('shrinks the gap to 0 when no other ready showable cards exist', () => {
    let state = createLessonQueueState({ scope: 'DECK' });

    state = answer(state, 'a', []);

    expect(state.pendingRepeats.a).toEqual({ targetGap: 0, filled: 0 });
    expect(selectNextLessonCard({ state, candidates: [card('a', t0)] })).toBe(
      'a',
    );
  });

  it('gives a showable repeat priority over the next primary', () => {
    let state = createLessonQueueState({ scope: 'DECK' });
    const afterA = [card('b', t0), card('c', t1), card('d', t2)];

    state = answer(state, 'a', afterA);
    state = answer(state, 'b', [card('a', t0), card('c', t1), card('d', t2)]);
    state = answer(state, 'c', [card('a', t0), card('d', t2)]);
    state = answer(state, 'd', [card('a', t0), card('e', t1)]);

    expect(
      selectNextLessonCard({
        state,
        candidates: [card('a', t0), card('e', t1)],
      }),
    ).toBe('a');
  });

  it('orders showable repeats by dueAt then cardId', () => {
    const state: LessonQueueState = {
      scope: 'DECK',
      snapshotCardIds: [],
      showCounts: { a: 1, b: 1 },
      pendingRepeats: {
        a: { targetGap: 0, filled: 0 },
        b: { targetGap: 0, filled: 0 },
      },
    };

    expect(
      selectNextLessonCard({
        state,
        candidates: [card('b', t0), card('a', t0)],
      }),
    ).toBe('a');
  });
});

describe('recordLessonCardAnswer', () => {
  it('does not mutate the previous state', () => {
    const state = createLessonQueueState({ scope: 'DECK' });

    recordLessonCardAnswer({
      state,
      answeredCardId: 'a',
      candidates: [card('b', t0)],
    });

    expect(state.showCounts).toEqual({});
    expect(state.pendingRepeats).toEqual({});
  });
});
