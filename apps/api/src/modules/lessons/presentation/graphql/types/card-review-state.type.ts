import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('CardReviewState')
export class CardReviewStateType {
  @Field()
  id: string;

  @Field()
  cardId: string;

  @Field(() => Float)
  easeFactor: number;

  @Field(() => Int)
  intervalDays: number;

  @Field(() => Int)
  repetitions: number;

  @Field()
  dueAt: Date;

  @Field(() => Date, { nullable: true })
  lastReviewedAt: Date | null;
}
