import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import {
  DECK_GROUP_SHARE_REPOSITORY,
  DeckGroupShareRepositoryPort,
} from '../../../groups/application/ports/deck-group-share-repository.port';
import { Deck } from '../../domain/types';
import { DeckOrigin } from '../../domain/types/deck-origin.type';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

const PUBLIC_SECTION_LIMIT = 50;

export type DecksPageUseCaseInput = {
  currentUserId: string;
  activeTargetLanguage: string;
};

export type DecksPageDeckItem = Deck & {
  origin: DeckOrigin;
};

export type DecksPageUseCaseResult = {
  ownDecks: DecksPageDeckItem[];
  groupDecks: DecksPageDeckItem[];
  publicDecks: DecksPageDeckItem[];
  noLanguageDecks: DecksPageDeckItem[];
};

@Injectable()
export class DecksPageUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(DECK_GROUP_SHARE_REPOSITORY)
    private readonly deckGroupShareRepository: DeckGroupShareRepositoryPort,
  ) {}

  async execute(input: DecksPageUseCaseInput): Promise<DecksPageUseCaseResult> {
    const activeTargetLanguage = this.normalizeActiveTargetLanguage(
      input.activeTargetLanguage,
    );

    const user = await this.userRepository.findById(input.currentUserId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const [ownedDecks, sharedDecks, publicMatching, publicNullLanguage] =
      await Promise.all([
        this.deckRepository.findByOwner(input.currentUserId),
        this.deckGroupShareRepository.findSharedDecksForUser(
          input.currentUserId,
        ),
        this.deckRepository.searchPublicApproved({
          targetLanguage: activeTargetLanguage,
          limit: PUBLIC_SECTION_LIMIT,
          offset: 0,
        }),
        this.deckRepository.searchPublicApproved({
          requireNullTargetLanguage: true,
          limit: PUBLIC_SECTION_LIMIT,
          offset: 0,
        }),
      ]);

    const ownDecks = ownedDecks
      .filter((deck) => deck.targetLanguage === activeTargetLanguage)
      .map((deck) => this.withOrigin(deck, 'OWN'));

    const ownedIds = new Set(ownedDecks.map((deck) => deck.id));

    const groupDecks = sharedDecks
      .filter(
        (deck) =>
          deck.targetLanguage === activeTargetLanguage &&
          !ownedIds.has(deck.id),
      )
      .map((deck) => this.withOrigin(deck, 'GROUP'));

    const publicDecks = publicMatching.items
      .filter((deck) => !ownedIds.has(deck.id))
      .map((deck) => this.withOrigin(deck, 'PUBLIC'));

    const noLanguageDecks = this.buildNoLanguageSection({
      ownedDecks,
      sharedDecks,
      publicNullLanguageDecks: publicNullLanguage.items,
      ownedIds,
    });

    return {
      ownDecks,
      groupDecks,
      publicDecks,
      noLanguageDecks,
    };
  }

  private buildNoLanguageSection(input: {
    ownedDecks: Deck[];
    sharedDecks: Deck[];
    publicNullLanguageDecks: Deck[];
    ownedIds: Set<string>;
  }): DecksPageDeckItem[] {
    const items: DecksPageDeckItem[] = [];
    const seen = new Set<string>();

    for (const deck of input.ownedDecks) {
      if (deck.targetLanguage !== null || seen.has(deck.id)) {
        continue;
      }

      seen.add(deck.id);
      items.push(this.withOrigin(deck, 'OWN'));
    }

    for (const deck of input.sharedDecks) {
      if (
        deck.targetLanguage !== null ||
        seen.has(deck.id) ||
        input.ownedIds.has(deck.id)
      ) {
        continue;
      }

      seen.add(deck.id);
      items.push(this.withOrigin(deck, 'GROUP'));
    }

    for (const deck of input.publicNullLanguageDecks) {
      if (deck.targetLanguage !== null || seen.has(deck.id)) {
        continue;
      }

      seen.add(deck.id);
      items.push(this.withOrigin(deck, 'PUBLIC'));
    }

    return items;
  }

  private withOrigin(deck: Deck, origin: DeckOrigin): DecksPageDeckItem {
    return {
      ...deck,
      origin,
    };
  }

  private normalizeActiveTargetLanguage(activeTargetLanguage: string): string {
    const trimmed = activeTargetLanguage.trim();

    if (trimmed.length === 0) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'activeTargetLanguage is required',
      );
    }

    return trimmed;
  }
}
