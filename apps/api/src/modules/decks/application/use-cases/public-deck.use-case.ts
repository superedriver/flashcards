import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { Deck } from '../../domain/types';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type PublicDeckUseCaseInput = {
  deckId: string;
};

export type PublicDeckUseCaseResult = Deck;

@Injectable()
export class PublicDeckUseCase {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(
    input: PublicDeckUseCaseInput,
  ): Promise<PublicDeckUseCaseResult> {
    const deck = await this.deckRepository.findPublicApprovedById(input.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    return deck;
  }
}
