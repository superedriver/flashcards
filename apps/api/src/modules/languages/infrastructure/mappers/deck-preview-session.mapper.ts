import {
  DeckPreviewSession,
  DeckPreviewSessionCard,
  DeckPreviewSessionStatus,
  DeckPreviewSessionType,
} from '../../domain/types';

type PrismaDeckPreviewSessionRecord = {
  id: string;
  userId: string;
  type: string;
  status: string;
  sourceDeckId: string | null;
  targetLanguage: string;
  chosenSourceLanguage: string;
  cards: unknown;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

function toDeckPreviewSessionCard(value: unknown): DeckPreviewSessionCard {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Invalid preview session card payload');
  }

  const card = value as Record<string, unknown>;

  return {
    sourceCardId:
      typeof card.sourceCardId === 'string' ? card.sourceCardId : undefined,
    front: typeof card.front === 'string' ? card.front : '',
    back: typeof card.back === 'string' ? card.back : '',
    example:
      card.example === null || card.example === undefined
        ? null
        : typeof card.example === 'string'
          ? card.example
          : null,
    backError: typeof card.backError === 'string' ? card.backError : undefined,
    exampleError:
      typeof card.exampleError === 'string' ? card.exampleError : undefined,
  };
}

export function toDeckPreviewSession(
  record: PrismaDeckPreviewSessionRecord,
): DeckPreviewSession {
  const cards = Array.isArray(record.cards)
    ? record.cards.map(toDeckPreviewSessionCard)
    : [];

  return {
    id: record.id,
    userId: record.userId,
    type: record.type as DeckPreviewSessionType,
    status: record.status as DeckPreviewSessionStatus,
    sourceDeckId: record.sourceDeckId,
    targetLanguage: record.targetLanguage,
    chosenSourceLanguage: record.chosenSourceLanguage,
    cards,
    expiresAt: record.expiresAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toDeckPreviewSessionCardsJson(
  cards: DeckPreviewSessionCard[],
): DeckPreviewSessionCard[] {
  return cards.map((card) => ({
    ...(card.sourceCardId ? { sourceCardId: card.sourceCardId } : {}),
    front: card.front,
    back: card.back,
    example: card.example,
    ...(card.backError ? { backError: card.backError } : {}),
    ...(card.exampleError ? { exampleError: card.exampleError } : {}),
  }));
}
