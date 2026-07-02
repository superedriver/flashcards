import { Field, InputType } from '@nestjs/graphql';
import { ReviewAnswer } from '../types/review-answer.type';

@InputType()
export class SubmitReviewInput {
  @Field()
  sessionId: string;

  @Field()
  cardId: string;

  @Field(() => ReviewAnswer)
  answer: ReviewAnswer;
}
