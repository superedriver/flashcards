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
import { DeckPermissionService } from '../../../decks/domain/services/deck-permission.service';
import { Card } from '../../../decks/domain/types';

export type SaveGeneratedCardExampleUseCaseInput = {
  currentUser: AuthUser;
  cardId: string;
  exampleText: string;
};

export type SaveGeneratedCardExampleUseCaseResult = {
  card: Card;
};

const EXAMPLE_MAX_LENGTH = 4000;

@Injectable()
export class SaveGeneratedCardExampleUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(
    input: SaveGeneratedCardExampleUseCaseInput,
  ): Promise<SaveGeneratedCardExampleUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

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

    const exampleText = input.exampleText.trim();

    if (!exampleText) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Example text is required',
      );
    }

    if (exampleText.length > EXAMPLE_MAX_LENGTH) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Example must be at most 4000 characters',
      );
    }

    const updatedCard = await this.cardRepository.update({
      cardId: input.cardId,
      example: exampleText,
    });

    return { card: updatedCard };
  }
}
