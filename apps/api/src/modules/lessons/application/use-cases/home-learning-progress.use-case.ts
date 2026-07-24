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
import { AuthUser } from '../../../auth/domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../../../decks/application/ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../../../decks/application/ports/deck-repository.port';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../ports/card-review-state-repository.port';

export type HomeLearningProgressUseCaseInput = {
  currentUser: AuthUser;
};

export type HomeLearningProgressUseCaseResult = {
  activeTargetLanguage: string | null;
  toLearnCount: number;
  practicedCount: number;
  learnedCount: number;
  dueCount: number;
  totalCardCount: number;
};

@Injectable()
export class HomeLearningProgressUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
  ) {}

  async execute(
    input: HomeLearningProgressUseCaseInput,
  ): Promise<HomeLearningProgressUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    let settings = await this.userSettingsRepository.findByUserId(
      input.currentUser.id,
    );

    if (!settings) {
      settings = await this.userSettingsRepository.createForUser(
        input.currentUser.id,
      );
    }

    const activeTargetLanguage = settings.activeTargetLanguage;

    if (!activeTargetLanguage) {
      return {
        activeTargetLanguage: null,
        toLearnCount: 0,
        practicedCount: 0,
        learnedCount: 0,
        dueCount: 0,
        totalCardCount: 0,
      };
    }

    const now = new Date();
    const ownedDecks = (
      await this.deckRepository.findByOwner(input.currentUser.id)
    ).filter((deck) => deck.targetLanguage === activeTargetLanguage);

    let totalCardCount = 0;
    for (const deck of ownedDecks) {
      totalCardCount += await this.cardRepository.countByDeckId(deck.id);
    }

    const groups =
      await this.cardReviewStateRepository.countLearningGroupsForOwnDecksWithTargetLanguage(
        {
          userId: input.currentUser.id,
          targetLanguage: activeTargetLanguage,
        },
      );

    const dueCount =
      await this.cardReviewStateRepository.countDueForOwnDecksWithTargetLanguage(
        {
          userId: input.currentUser.id,
          targetLanguage: activeTargetLanguage,
          now,
        },
      );

    return {
      activeTargetLanguage,
      toLearnCount: groups.toLearnCount,
      practicedCount: groups.practicedCount,
      learnedCount: groups.learnedCount,
      dueCount,
      totalCardCount,
    };
  }
}
