import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { StartLessonUseCase } from '../../../application/use-cases/start-lesson.use-case';
import { CardReviewState } from '../../../domain/types';
import { StartLessonInput } from '../inputs/start-lesson.input';
import { CardReviewStateType } from '../types/card-review-state.type';
import { StartLessonPayloadType } from '../types/start-lesson-payload.type';

@Resolver()
export class LessonsResolver {
  constructor(private readonly startLessonUseCase: StartLessonUseCase) {}

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
