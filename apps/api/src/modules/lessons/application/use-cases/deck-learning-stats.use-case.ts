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
import { canViewDeck } from '../../../decks/application/services/deck-view-access.service';
import { DeckPermissionService } from '../../../decks/domain/services/deck-permission.service';
import {
  DECK_GROUP_SHARE_REPOSITORY,
  DeckGroupShareRepositoryPort,
} from '../../../groups/application/ports/deck-group-share-repository.port';
import { DeckLearningStats } from '../../domain/types';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../ports/card-review-state-repository.port';

export type DeckLearningStatsUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
};

export type DeckLearningStatsUseCaseResult = DeckLearningStats;

@Injectable()
export class DeckLearningStatsUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
    @Inject(DECK_GROUP_SHARE_REPOSITORY)
    private readonly deckGroupShareRepository: DeckGroupShareRepositoryPort,
  ) {}

  async execute(
    input: DeckLearningStatsUseCaseInput,
  ): Promise<DeckLearningStatsUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

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

    const now = new Date();
    const totalCards = await this.cardRepository.countByDeckId(input.deckId);
    const reviewedCards =
      await this.cardReviewStateRepository.countReviewedForDeck({
        userId: input.currentUser.id,
        deckId: input.deckId,
      });
    const dueCards = await this.cardReviewStateRepository.countDueForDeck({
      userId: input.currentUser.id,
      deckId: input.deckId,
      now,
    });
    const nextDueAt = await this.cardReviewStateRepository.findNextDueAtForDeck(
      {
        userId: input.currentUser.id,
        deckId: input.deckId,
        now,
      },
    );

    return {
      deckId: input.deckId,
      totalCards,
      newCards: totalCards - reviewedCards,
      dueCards,
      reviewedCards,
      nextDueAt,
    };
  }
}
