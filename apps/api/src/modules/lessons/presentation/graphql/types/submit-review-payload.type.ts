import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CardReviewStateType } from './card-review-state.type';

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
}
