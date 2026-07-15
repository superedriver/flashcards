import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../../../decks/application/ports/deck-repository.port';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepositoryPort,
} from '../ports/language-repository.port';

export type StudyLanguageRemovalImpactUseCaseInput = {
  currentUserId: string;
  languageCode: string;
};

export type StudyLanguageRemovalImpactUseCaseResult = {
  affectedDeckCount: number;
};

@Injectable()
export class StudyLanguageRemovalImpactUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(
    input: StudyLanguageRemovalImpactUseCaseInput,
  ): Promise<StudyLanguageRemovalImpactUseCaseResult> {
    await this.ensureActiveUser(input.currentUserId);
    await this.ensureLanguageExists(input.languageCode);

    const affectedDeckCount =
      await this.deckRepository.countByOwnerAndTargetLanguage(
        input.currentUserId,
        input.languageCode,
      );

    return { affectedDeckCount };
  }

  private async ensureActiveUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }
  }

  private async ensureLanguageExists(languageCode: string): Promise<void> {
    const language = await this.languageRepository.findByCode(languageCode);

    if (!language) {
      throw new ApplicationError(
        ErrorCodes.LANGUAGE_NOT_FOUND,
        'Language not found',
      );
    }
  }
}
