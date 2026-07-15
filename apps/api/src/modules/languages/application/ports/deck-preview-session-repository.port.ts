import {
  DeckPreviewSession,
  DeckPreviewSessionCard,
  DeckPreviewSessionStatus,
  DeckPreviewSessionType,
} from '../../domain/types';

export const DECK_PREVIEW_SESSION_REPOSITORY = Symbol(
  'DECK_PREVIEW_SESSION_REPOSITORY',
);

export type CreateDeckPreviewSessionInput = {
  userId: string;
  type: DeckPreviewSessionType;
  sourceDeckId?: string | null;
  targetLanguage: string;
  chosenSourceLanguage: string;
  cards: DeckPreviewSessionCard[];
  expiresAt: Date;
};

export type UpdateDeckPreviewSessionCardsInput = {
  sessionId: string;
  cards: DeckPreviewSessionCard[];
};

export type UpdateDeckPreviewSessionStatusInput = {
  sessionId: string;
  status: DeckPreviewSessionStatus;
};

export type DeckPreviewSessionRepositoryPort = {
  create(input: CreateDeckPreviewSessionInput): Promise<DeckPreviewSession>;
  findById(sessionId: string): Promise<DeckPreviewSession | null>;
  findActiveByUserId(
    userId: string,
    now: Date,
  ): Promise<DeckPreviewSession | null>;
  updateCards(
    input: UpdateDeckPreviewSessionCardsInput,
  ): Promise<DeckPreviewSession>;
  updateStatus(
    input: UpdateDeckPreviewSessionStatusInput,
  ): Promise<DeckPreviewSession>;
  delete(sessionId: string): Promise<void>;
  deleteExpiredSessions(now: Date): Promise<number>;
};
