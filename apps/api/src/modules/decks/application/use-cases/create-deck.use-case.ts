import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { Deck } from '../../domain/types';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type CreateDeckUseCaseInput = {
  currentUserId: string;
  title: string;
  description?: string | null;
};

export type CreateDeckUseCaseResult = Deck;

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

@Injectable()
export class CreateDeckUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(
    input: CreateDeckUseCaseInput,
  ): Promise<CreateDeckUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUserId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

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

    let description: string | null | undefined;
    if (input.description !== undefined) {
      description =
        input.description === null ? null : input.description.trim() || null;

      if (description !== null && description.length > DESCRIPTION_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Description must be at most 1000 characters',
        );
      }
    }

    return this.deckRepository.create({
      ownerId: input.currentUserId,
      title,
      description,
    });
  }
}
