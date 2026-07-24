import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CardReviewStateType } from './card-review-state.type';
import { LessonCardType } from './lesson-card.type';

@ObjectType('SubmitReviewPayload')
export class SubmitReviewPayloadType {
  @Field()
  sessionId: string;

  @Field()
  cardId: string;

  @Field(() => CardReviewStateType)
  reviewState: CardReviewStateType;

  @Field(() => Int)
  reviewedCards: number;

  @Field(() => LessonCardType, { nullable: true })
  nextCard: LessonCardType | null;
}
