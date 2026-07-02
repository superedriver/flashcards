import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import {
  DECK_GROUP_SHARE_REPOSITORY,
  DeckGroupShareRepositoryPort,
} from '../../../groups/application/ports/deck-group-share-repository.port';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import { Card } from '../../domain/types';
import { canViewDeck } from '../services/deck-view-access.service';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type DeckCardsUseCaseInput = {
  currentUser: AuthUser | null;
  deckId: string;
};

export type DeckCardsUseCaseResult = Card[];

@Injectable()
export class DeckCardsUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_GROUP_SHARE_REPOSITORY)
    private readonly deckGroupShareRepository: DeckGroupShareRepositoryPort,
  ) {}

  async execute(input: DeckCardsUseCaseInput): Promise<DeckCardsUseCaseResult> {
    const deck = await this.deckRepository.findById(input.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canView = await canViewDeck({
      user: input.currentUser,
      deck,
      deckPermissionService: this.deckPermissionService,
      deckGroupShareRepository: this.deckGroupShareRepository,
    });

    if (!canView) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    return this.cardRepository.findByDeckId(input.deckId);
  }
}
