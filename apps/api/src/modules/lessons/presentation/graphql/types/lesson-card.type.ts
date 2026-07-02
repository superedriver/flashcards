import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CardReviewStateType } from './card-review-state.type';

@ObjectType('LessonCard')
export class LessonCardType {
  @Field()
  cardId: string;

  @Field()
  front: string;

  @Field()
  back: string;

  @Field(() => String, { nullable: true })
  example: string | null;

  @Field(() => String, { nullable: true })
  notes: string | null;

  @Field(() => Int)
  position: number;

  @Field(() => CardReviewStateType, { nullable: true })
  reviewState: CardReviewStateType | null;
}
