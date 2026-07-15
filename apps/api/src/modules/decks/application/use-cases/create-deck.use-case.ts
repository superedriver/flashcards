import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_SETTINGS_REPOSITORY,
  UserSettingsRepositoryPort,
} from '../../../account/application/ports/user-settings-repository.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepositoryPort,
} from '../../../languages/application/ports/language-repository.port';
import { Deck } from '../../domain/types';
import { DeckLanguageWarning } from '../../domain/types/deck-language-warning.type';
import { DeckLanguageValidationService } from '../../domain/services/deck-language-validation.service';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type CreateDeckUseCaseInput = {
  currentUserId: string;
  title: string;
  description?: string | null;
  targetLanguage: string;
  sourceLanguage?: string;
};

export type CreateDeckUseCaseResult = {
  deck: Deck;
  warnings: DeckLanguageWarning[];
};

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

@Injectable()
export class CreateDeckUseCase {
  private readonly deckLanguageValidationService =
    new DeckLanguageValidationService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepositoryPort,
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

    const targetLanguage = input.targetLanguage.trim();

    if (!targetLanguage) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Target language is required',
      );
    }

    await this.ensureLanguageExists(targetLanguage);

    let sourceLanguage = input.sourceLanguage?.trim();

    if (!sourceLanguage) {
      const settings = await this.userSettingsRepository.findByUserId(
        input.currentUserId,
      );

      if (!settings) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Source language is required',
        );
      }

      sourceLanguage = settings.nativeLanguage;
    }

    await this.ensureLanguageExists(sourceLanguage);

    const deck = await this.deckRepository.create({
      ownerId: input.currentUserId,
      title,
      description,
      targetLanguage,
      sourceLanguage,
    });

    return {
      deck,
      warnings: this.deckLanguageValidationService.getLanguagePairWarnings(
        targetLanguage,
        sourceLanguage,
      ),
    };
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
