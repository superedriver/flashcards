import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type CopyPublicDeckUseCaseInput = {
  currentUser: AuthUser;
  sourceDeckId: string;
};

export type CopyPublicDeckUseCaseResult = {
  deck: Deck;
  cards: Card[];
};

@Injectable()
export class CopyPublicDeckUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
  ) {}

  async execute(
    input: CopyPublicDeckUseCaseInput,
  ): Promise<CopyPublicDeckUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const sourceDeck = await this.deckRepository.findPublicApprovedById(
      input.sourceDeckId,
    );

    if (!sourceDeck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const sourceCards = await this.cardRepository.findByDeckId(
      input.sourceDeckId,
    );

    const copiedDeck = await this.deckRepository.createCopiedDeck({
      ownerId: input.currentUser.id,
      sourceDeckId: sourceDeck.id,
      title: sourceDeck.title,
      description: sourceDeck.description,
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
