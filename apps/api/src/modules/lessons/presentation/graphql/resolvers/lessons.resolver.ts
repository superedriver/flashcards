import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { AbandonLessonUseCase } from '../../../application/use-cases/abandon-lesson.use-case';
import { CompleteLessonUseCase } from '../../../application/use-cases/complete-lesson.use-case';
import { DeckLearningStatsUseCase } from '../../../application/use-cases/deck-learning-stats.use-case';
import { StartLessonUseCase } from '../../../application/use-cases/start-lesson.use-case';
import { SubmitReviewUseCase } from '../../../application/use-cases/submit-review.use-case';
import { CardReviewState } from '../../../domain/types';
import { AbandonLessonInput } from '../inputs/abandon-lesson.input';
import { CompleteLessonInput } from '../inputs/complete-lesson.input';
import { StartLessonInput } from '../inputs/start-lesson.input';
import { SubmitReviewInput } from '../inputs/submit-review.input';
import { AbandonLessonPayloadType } from '../types/abandon-lesson-payload.type';
import { CardReviewStateType } from '../types/card-review-state.type';
import { CompleteLessonPayloadType } from '../types/complete-lesson-payload.type';
import { DeckLearningStatsType } from '../types/deck-learning-stats.type';
import { StartLessonPayloadType } from '../types/start-lesson-payload.type';
import { SubmitReviewPayloadType } from '../types/submit-review-payload.type';

@Resolver()
export class LessonsResolver {
  constructor(
    private readonly startLessonUseCase: StartLessonUseCase,
    private readonly submitReviewUseCase: SubmitReviewUseCase,
    private readonly completeLessonUseCase: CompleteLessonUseCase,
    private readonly abandonLessonUseCase: AbandonLessonUseCase,
    private readonly deckLearningStatsUseCase: DeckLearningStatsUseCase,
  ) {}

  @Query(() => DeckLearningStatsType)
  @UseGuards(GqlAuthGuard)
  async deckLearningStats(
    @CurrentUser() user: AuthUser,
    @Args('deckId') deckId: string,
  ): Promise<DeckLearningStatsType> {
    return this.deckLearningStatsUseCase.execute({
      currentUser: user,
      deckId,
    });
  }

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

  @Mutation(() => CompleteLessonPayloadType)
  @UseGuards(GqlAuthGuard)
  async completeLesson(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CompleteLessonInput,
  ): Promise<CompleteLessonPayloadType> {
    return this.completeLessonUseCase.execute({
      currentUser: user,
      sessionId: input.sessionId,
    });
  }

  @Mutation(() => AbandonLessonPayloadType)
  @UseGuards(GqlAuthGuard)
  async abandonLesson(
    @CurrentUser() user: AuthUser,
    @Args('input') input: AbandonLessonInput,
  ): Promise<AbandonLessonPayloadType> {
    return this.abandonLessonUseCase.execute({
      currentUser: user,
      sessionId: input.sessionId,
    });
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
