import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { Card } from '../../domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type PublicDeckCardsUseCaseInput = {
  deckId: string;
};

export type PublicDeckCardsUseCaseResult = Card[];

@Injectable()
export class PublicDeckCardsUseCase {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
  ) {}

  async execute(
    input: PublicDeckCardsUseCaseInput,
  ): Promise<PublicDeckCardsUseCaseResult> {
    const deck = await this.deckRepository.findPublicApprovedById(input.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    return this.cardRepository.findByDeckId(input.deckId);
  }
}
