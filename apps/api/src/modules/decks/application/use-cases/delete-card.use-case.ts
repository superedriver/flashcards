import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type DeleteCardUseCaseInput = {
  currentUser: AuthUser;
  cardId: string;
};

export type DeleteCardUseCaseResult = {
  success: boolean;
};

@Injectable()
export class DeleteCardUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(
    input: DeleteCardUseCaseInput,
  ): Promise<DeleteCardUseCaseResult> {
    const card = await this.cardRepository.findById(input.cardId);

    if (!card) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    const deck = await this.deckRepository.findById(card.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canManage = this.deckPermissionService.canManageCard({
      user: input.currentUser,
      deck,
    });

    if (!canManage) {
      throw new ApplicationError(ErrorCodes.CARD_FORBIDDEN, 'Card forbidden');
    }

    await this.cardRepository.softDelete(input.cardId);

    return { success: true };
  }
}
