import { StudySessionScope } from '../types/study-session-scope.type';

export type LessonQueueCandidate = {
  cardId: string;
  dueAt: Date;
  createdAt: Date;
};

export type LessonQueuePendingRepeat = {
  targetGap: number;
  filled: number;
};

export type LessonQueueState = {
  scope: StudySessionScope;
  snapshotCardIds: string[];
  showCounts: Record<string, number>;
  pendingRepeats: Record<string, LessonQueuePendingRepeat>;
};

export type SelectNextLessonCardInput = {
  state: LessonQueueState;
  candidates: LessonQueueCandidate[];
};

export type RecordLessonCardShowingInput = {
  state: LessonQueueState;
  shownCardId: string;
  candidates: LessonQueueCandidate[];
};

const MAX_SHOWINGS = 3;
const MAX_GAP = 3;

export function createLessonQueueState(input: {
  scope: StudySessionScope;
  snapshotCardIds?: string[];
}): LessonQueueState {
  return {
    scope: input.scope,
    snapshotCardIds: input.snapshotCardIds ?? [],
    showCounts: {},
    pendingRepeats: {},
  };
}

export function selectNextLessonCard(
  input: SelectNextLessonCardInput,
): string | null {
  const eligible = getEligibleCandidates(input.state, input.candidates);

  if (eligible.length === 0) {
    return null;
  }

  const showableRepeats = eligible.filter((candidate) =>
    isShowableRepeat(input.state, candidate.cardId, eligible),
  );

  if (showableRepeats.length > 0) {
    return sortRepeats(showableRepeats)[0]?.cardId ?? null;
  }

  const primaries = eligible.filter(
    (candidate) => getShowCount(input.state, candidate.cardId) === 0,
  );

  return sortPrimaries(primaries)[0]?.cardId ?? null;
}

export function recordLessonCardShowing(
  input: RecordLessonCardShowingInput,
): LessonQueueState {
  const nextState = cloneState(input.state);
  const shownCardId = input.shownCardId;

  for (const [cardId, pending] of Object.entries(nextState.pendingRepeats)) {
    if (cardId !== shownCardId) {
      pending.filled += 1;
    }
  }

  const showCount = getShowCount(nextState, shownCardId) + 1;
  nextState.showCounts[shownCardId] = showCount;

  if (showCount >= MAX_SHOWINGS) {
    delete nextState.pendingRepeats[shownCardId];
    return nextState;
  }

  const eligible = getEligibleCandidates(nextState, input.candidates);
  const otherReadyShowableCount = eligible.filter(
    (candidate) => candidate.cardId !== shownCardId,
  ).length;

  nextState.pendingRepeats[shownCardId] = {
    targetGap: Math.min(MAX_GAP, otherReadyShowableCount),
    filled: 0,
  };

  return nextState;
}

function getEligibleCandidates(
  state: LessonQueueState,
  candidates: LessonQueueCandidate[],
): LessonQueueCandidate[] {
  return candidates.filter((candidate) => {
    if (!isInSessionMembership(state, candidate.cardId)) {
      return false;
    }

    return getShowCount(state, candidate.cardId) < MAX_SHOWINGS;
  });
}

function isInSessionMembership(
  state: LessonQueueState,
  cardId: string,
): boolean {
  if (state.scope === 'HOME_ACTIVE_TARGET') {
    return state.snapshotCardIds.includes(cardId);
  }

  return true;
}

function isShowableRepeat(
  state: LessonQueueState,
  cardId: string,
  eligible: LessonQueueCandidate[],
): boolean {
  const showCount = getShowCount(state, cardId);

  if (showCount < 1 || showCount >= MAX_SHOWINGS) {
    return false;
  }

  const pending = state.pendingRepeats[cardId];
  const otherReadyShowableCount = eligible.filter(
    (candidate) => candidate.cardId !== cardId,
  ).length;

  if (!pending) {
    return otherReadyShowableCount === 0;
  }

  if (otherReadyShowableCount === 0) {
    return true;
  }

  return pending.filled >= pending.targetGap;
}

function sortPrimaries(
  candidates: LessonQueueCandidate[],
): LessonQueueCandidate[] {
  return [...candidates].sort((left, right) => {
    const dueDelta = left.dueAt.getTime() - right.dueAt.getTime();

    if (dueDelta !== 0) {
      return dueDelta;
    }

    const createdDelta = left.createdAt.getTime() - right.createdAt.getTime();

    if (createdDelta !== 0) {
      return createdDelta;
    }

    return left.cardId.localeCompare(right.cardId);
  });
}

function sortRepeats(
  candidates: LessonQueueCandidate[],
): LessonQueueCandidate[] {
  return [...candidates].sort((left, right) => {
    const dueDelta = left.dueAt.getTime() - right.dueAt.getTime();

    if (dueDelta !== 0) {
      return dueDelta;
    }

    return left.cardId.localeCompare(right.cardId);
  });
}

function getShowCount(state: LessonQueueState, cardId: string): number {
  return state.showCounts[cardId] ?? 0;
}

function cloneState(state: LessonQueueState): LessonQueueState {
  return {
    scope: state.scope,
    snapshotCardIds: [...state.snapshotCardIds],
    showCounts: { ...state.showCounts },
    pendingRepeats: Object.fromEntries(
      Object.entries(state.pendingRepeats).map(([cardId, pending]) => [
        cardId,
        { targetGap: pending.targetGap, filled: pending.filled },
      ]),
    ),
  };
}
