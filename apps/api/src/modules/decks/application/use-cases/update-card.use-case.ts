import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import { Card } from '../../domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type UpdateCardUseCaseInput = {
  currentUser: AuthUser;
  cardId: string;
  front?: string;
  back?: string;
  example?: string | null;
  notes?: string | null;
  position?: number;
};

export type UpdateCardUseCaseResult = Card;

const FRONT_MAX_LENGTH = 2000;
const BACK_MAX_LENGTH = 4000;
const OPTIONAL_TEXT_MAX_LENGTH = 4000;

@Injectable()
export class UpdateCardUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(
    input: UpdateCardUseCaseInput,
  ): Promise<UpdateCardUseCaseResult> {
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

    const updateData: {
      front?: string;
      back?: string;
      example?: string | null;
      notes?: string | null;
      position?: number;
    } = {};

    if (input.front !== undefined) {
      const front = input.front.trim();

      if (!front) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Front is required',
        );
      }

      if (front.length > FRONT_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Front must be at most 2000 characters',
        );
      }

      updateData.front = front;
    }

    if (input.back !== undefined) {
      const back = input.back.trim();

      if (!back) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Back is required',
        );
      }

      if (back.length > BACK_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Back must be at most 4000 characters',
        );
      }

      updateData.back = back;
    }

    if (input.example !== undefined) {
      const example =
        input.example === null ? null : input.example.trim() || null;

      if (example !== null && example.length > OPTIONAL_TEXT_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Example must be at most 4000 characters',
        );
      }

      updateData.example = example;
    }

    if (input.notes !== undefined) {
      const notes = input.notes === null ? null : input.notes.trim() || null;

      if (notes !== null && notes.length > OPTIONAL_TEXT_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Notes must be at most 4000 characters',
        );
      }

      updateData.notes = notes;
    }

    if (input.position !== undefined) {
      if (!Number.isInteger(input.position) || input.position < 0) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Position must be a non-negative integer',
        );
      }

      updateData.position = input.position;
    }

    return this.cardRepository.update({
      cardId: input.cardId,
      ...updateData,
    });
  }
}
