import { DeckModerationStatus } from '../../../decks/domain/types';
import { ModerationDeck } from '../../domain/types';

export const ADMIN_DECK_REPOSITORY = Symbol('ADMIN_DECK_REPOSITORY');

export type ModerationQueueInput = {
  status?: DeckModerationStatus | null;
  limit: number;
  offset: number;
};

export type ModerationQueueResult = {
  items: ModerationDeck[];
  total: number;
};

export type AdminDeckRepositoryPort = {
  moderationQueue(input: ModerationQueueInput): Promise<ModerationQueueResult>;
  setModerationStatus(input: {
    deckId: string;
    status: DeckModerationStatus;
  }): Promise<ModerationDeck>;
  setOfficial(input: {
    deckId: string;
    isOfficial: boolean;
  }): Promise<ModerationDeck>;
};
