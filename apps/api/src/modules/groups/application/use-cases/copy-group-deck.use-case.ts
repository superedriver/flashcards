import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../../../decks/application/ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../../../decks/application/ports/deck-repository.port';
import { Card, Deck } from '../../../decks/domain/types';
import {
  DECK_GROUP_SHARE_REPOSITORY,
  DeckGroupShareRepositoryPort,
} from '../ports/deck-group-share-repository.port';

export type CopyGroupDeckUseCaseInput = {
  currentUser: AuthUser;
  sourceDeckId: string;
};

export type CopyGroupDeckUseCaseResult = {
  deck: Deck;
  cards: Card[];
};

@Injectable()
export class CopyGroupDeckUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_GROUP_SHARE_REPOSITORY)
    private readonly deckGroupShareRepository: DeckGroupShareRepositoryPort,
  ) {}

  async execute(
    input: CopyGroupDeckUseCaseInput,
  ): Promise<CopyGroupDeckUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const sourceDeck = await this.deckRepository.findById(input.sourceDeckId);

    if (!sourceDeck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const hasAccess = await this.deckGroupShareRepository.userHasAccessToDeck({
      userId: input.currentUser.id,
      deckId: sourceDeck.id,
    });

    if (!hasAccess) {
      throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
    }

    const sourceCards = await this.cardRepository.findByDeckId(sourceDeck.id);

    const copiedDeck = await this.deckRepository.createCopiedDeck({
      ownerId: input.currentUser.id,
      sourceDeckId: sourceDeck.id,
      title: sourceDeck.title,
      description: sourceDeck.description,
      targetLanguage: sourceDeck.targetLanguage,
      sourceLanguage: sourceDeck.sourceLanguage,
    });

    const copiedCards =
      sourceCards.length > 0
        ? await this.cardRepository.createMany({
            cards: sourceCards.map((card) => ({
              deckId: copiedDeck.id,
              front: card.front,
              back: card.back,
              example: card.example,
              notes: card.notes,
              position: card.position,
            })),
          })
        : [];

    return {
      deck: copiedDeck,
      cards: copiedCards,
    };
  }
}
