import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import { Deck } from '../../domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type PublishDeckUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
};

export type PublishDeckUseCaseResult = Deck;

@Injectable()
export class PublishDeckUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
  ) {}

  async execute(
    input: PublishDeckUseCaseInput,
  ): Promise<PublishDeckUseCaseResult> {
    const deck = await this.deckRepository.findById(input.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canManage = this.deckPermissionService.canManageDeck({
      user: input.currentUser,
      deck,
    });

    if (!canManage) {
      throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
    }

    const cardCount = await this.cardRepository.countByDeckId(input.deckId);

    if (cardCount === 0) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Deck must have at least one card',
      );
    }

    return this.deckRepository.publish({ deckId: input.deckId });
  }
}
