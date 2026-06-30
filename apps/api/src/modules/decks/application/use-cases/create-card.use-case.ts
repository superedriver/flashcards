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

export type CreateCardUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
  front: string;
  back: string;
  example?: string | null;
  notes?: string | null;
  position?: number;
};

export type CreateCardUseCaseResult = Card;

const FRONT_MAX_LENGTH = 2000;
const BACK_MAX_LENGTH = 4000;
const OPTIONAL_TEXT_MAX_LENGTH = 4000;

@Injectable()
export class CreateCardUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
  ) {}

  async execute(
    input: CreateCardUseCaseInput,
  ): Promise<CreateCardUseCaseResult> {
    const deck = await this.deckRepository.findById(input.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canCreate = this.deckPermissionService.canCreateCard({
      user: input.currentUser,
      deck,
    });

    if (!canCreate) {
      throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
    }

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

    let example: string | null | undefined;
    if (input.example !== undefined) {
      example = input.example === null ? null : input.example.trim() || null;

      if (example !== null && example.length > OPTIONAL_TEXT_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Example must be at most 4000 characters',
        );
      }
    }

    let notes: string | null | undefined;
    if (input.notes !== undefined) {
      notes = input.notes === null ? null : input.notes.trim() || null;

      if (notes !== null && notes.length > OPTIONAL_TEXT_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Notes must be at most 4000 characters',
        );
      }
    }

    let position = input.position;
    if (position === undefined) {
      position = await this.cardRepository.countByDeckId(input.deckId);
    } else if (!Number.isInteger(position) || position < 0) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Position must be a non-negative integer',
      );
    }

    return this.cardRepository.create({
      deckId: input.deckId,
      front,
      back,
      example,
      notes,
      position,
    });
  }
}
