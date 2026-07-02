import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { StartLessonUseCase } from '../../../application/use-cases/start-lesson.use-case';
import { SubmitReviewUseCase } from '../../../application/use-cases/submit-review.use-case';
import { CardReviewState } from '../../../domain/types';
import { StartLessonInput } from '../inputs/start-lesson.input';
import { SubmitReviewInput } from '../inputs/submit-review.input';
import { CardReviewStateType } from '../types/card-review-state.type';
import { StartLessonPayloadType } from '../types/start-lesson-payload.type';
import { SubmitReviewPayloadType } from '../types/submit-review-payload.type';

@Resolver()
export class LessonsResolver {
  constructor(
    private readonly startLessonUseCase: StartLessonUseCase,
    private readonly submitReviewUseCase: SubmitReviewUseCase,
  ) {}

  @Mutation(() => StartLessonPayloadType)
  @UseGuards(GqlAuthGuard)
  async startLesson(
    @CurrentUser() user: AuthUser,
    @Args('input') input: StartLessonInput,
  ): Promise<StartLessonPayloadType> {
    const result = await this.startLessonUseCase.execute({
      currentUser: user,
      deckId: input.deckId,
      lessonSize: input.lessonSize,
    });

    return {
      sessionId: result.sessionId,
      deckId: result.deckId,
      cards: result.cards.map((card) => ({
        cardId: card.cardId,
        front: card.front,
        back: card.back,
        example: card.example,
        notes: card.notes,
        position: card.position,
        reviewState: card.reviewState
          ? toCardReviewStateType(card.reviewState)
          : null,
      })),
      lessonSize: result.lessonSize,
      totalCards: result.totalCards,
    };
  }

  @Mutation(() => SubmitReviewPayloadType)
  @UseGuards(GqlAuthGuard)
  async submitReview(
    @CurrentUser() user: AuthUser,
    @Args('input') input: SubmitReviewInput,
  ): Promise<SubmitReviewPayloadType> {
    const result = await this.submitReviewUseCase.execute({
      currentUser: user,
      sessionId: input.sessionId,
      cardId: input.cardId,
      answer: input.answer,
    });

    return {
      sessionId: result.sessionId,
      cardId: result.cardId,
      reviewState: toCardReviewStateType(result.reviewState),
      reviewedCards: result.reviewedCards,
    };
  }
}

function toCardReviewStateType(
  reviewState: CardReviewState,
): CardReviewStateType {
  return {
    id: reviewState.id,
    cardId: reviewState.cardId,
    easeFactor: reviewState.easeFactor,
    intervalDays: reviewState.intervalDays,
    repetitions: reviewState.repetitions,
    dueAt: reviewState.dueAt,
    lastReviewedAt: reviewState.lastReviewedAt,
  };
}
