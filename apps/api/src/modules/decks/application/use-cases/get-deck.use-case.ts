import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import { Deck } from '../../domain/types';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type GetDeckUseCaseInput = {
  currentUser: AuthUser | null;
  deckId: string;
};

export type GetDeckUseCaseResult = Deck;

@Injectable()
export class GetDeckUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(input: GetDeckUseCaseInput): Promise<GetDeckUseCaseResult> {
    const deck = await this.deckRepository.findById(input.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canView = this.deckPermissionService.canViewDeck({
      user: input.currentUser,
      deck,
    });

    if (!canView) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    return deck;
  }
}
