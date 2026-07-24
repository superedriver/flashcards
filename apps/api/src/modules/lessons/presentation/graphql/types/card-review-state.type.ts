import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('CardReviewState')
export class CardReviewStateType {
  @Field()
  id: string;

  @Field(() => Int)
  learningStep: number;

  @Field(() => Int)
  longReviewSuccessCount: number;

  @Field()
  dueAt: Date;

  @Field(() => Date, { nullable: true })
  lastReviewedAt: Date | null;
}
