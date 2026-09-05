import { Inject, Injectable } from '@nestjs/common';
import {
  learningGroupForStep,
  toEffectivePresentationMode,
} from '@flashcards/srs';
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
import { Card } from '../../../decks/domain/types';
import { CardReviewState, StudySession } from '../../domain/types';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../ports/card-review-state-repository.port';
import {
  STUDY_SESSION_REPOSITORY,
  StudySessionRepositoryPort,
} from '../ports/study-session-repository.port';
import { LessonCard } from './start-lesson.use-case';

export type DisableAudioOnlyUseCaseInput = {
  currentUser: AuthUser;
  sessionId: string;
  cardId: string;
};

@Injectable()
export class DisableAudioOnlyUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
    @Inject(STUDY_SESSION_REPOSITORY)
    private readonly studySessionRepository: StudySessionRepositoryPort,
  ) {}

  async execute(input: DisableAudioOnlyUseCaseInput): Promise<LessonCard> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const session = await this.studySessionRepository.findById(input.sessionId);

    if (!session || session.userId !== input.currentUser.id) {
      throw new ApplicationError(
        ErrorCodes.LESSON_NOT_FOUND,
        'Lesson not found',
      );
    }

    if (session.status !== 'ACTIVE') {
      throw new ApplicationError(
        ErrorCodes.LESSON_NOT_ACTIVE,
        'Lesson is not active',
      );
    }

    const card = await this.cardRepository.findById(input.cardId);

    if (!card || card.deletedAt !== null) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    await this.assertCardBelongsToSession(session, card, input.currentUser.id);

    const reviewState = await this.cardReviewStateRepository.findByUserAndCard(
      input.currentUser.id,
      input.cardId,
    );

    if (!reviewState) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    if (!session.audioOnlyDisabled) {
      await this.studySessionRepository.updateAudioOnlyDisabled({
        sessionId: session.id,
        audioOnlyDisabled: true,
      });
    }

    return this.toLessonCard(card, reviewState);
  }

  private async assertCardBelongsToSession(
    session: StudySession,
    card: Card,
    userId: string,
  ): Promise<void> {
    if (session.scope === 'DECK') {
      if (!session.deckId || card.deckId !== session.deckId) {
        throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
      }

      return;
    }

    const snapshotCardIds =
      session.queueState?.snapshotCardIds ?? session.snapshotCardIds;

    if (!snapshotCardIds.includes(card.id)) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    const deck = await this.deckRepository.findById(card.deckId);

    if (!deck || deck.ownerId !== userId || deck.deletedAt !== null) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }
  }

  private toLessonCard(card: Card, reviewState: CardReviewState): LessonCard {
    const learningStep = reviewState.learningStep;

    return {
      cardId: card.id,
      deckId: card.deckId,
      front: card.front,
      back: card.back,
      example: card.example,
      notes: card.notes,
      position: card.position,
      learningStep,
      learningGroup: learningGroupForStep(learningStep),
      presentationMode: toEffectivePresentationMode('TARGET_AUDIO_ONLY', true),
      reviewState,
    };
  }
}
