import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import { Deck } from '../../domain/types';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type UpdateDeckUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
  title?: string;
  description?: string | null;
};

export type UpdateDeckUseCaseResult = Deck;

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

@Injectable()
export class UpdateDeckUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(
    input: UpdateDeckUseCaseInput,
  ): Promise<UpdateDeckUseCaseResult> {
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

    const updateData: {
      title?: string;
      description?: string | null;
    } = {};

    if (input.title !== undefined) {
      const title = input.title.trim();

      if (!title) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Title is required',
        );
      }

      if (title.length > TITLE_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Title must be at most 120 characters',
        );
      }

      updateData.title = title;
    }

    if (input.description !== undefined) {
      const description =
        input.description === null ? null : input.description.trim() || null;

      if (description !== null && description.length > DESCRIPTION_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Description must be at most 1000 characters',
        );
      }

      updateData.description = description;
    }

    return this.deckRepository.update({
      deckId: input.deckId,
      ...updateData,
    });
  }
}
