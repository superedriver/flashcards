export type DeckPreviewSessionType =
  'COPY_PUBLIC' | 'COPY_GROUP' | 'REGENERATE_DECK';

export type DeckPreviewSessionStatus = 'GENERATING' | 'READY' | 'EXPIRED';

export type DeckPreviewSessionCard = {
  sourceCardId?: string;
  front: string;
  back: string;
  example: string | null;
  backError?: string;
  exampleError?: string;
};

export type DeckPreviewSession = {
  id: string;
  userId: string;
  type: DeckPreviewSessionType;
  status: DeckPreviewSessionStatus;
  sourceDeckId: string | null;
  targetLanguage: string;
  chosenSourceLanguage: string;
  cards: DeckPreviewSessionCard[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const DECK_PREVIEW_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
