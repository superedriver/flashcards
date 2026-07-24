import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('HomeLearningProgress')
export class HomeLearningProgressType {
  @Field(() => String, { nullable: true })
  activeTargetLanguage: string | null;

  @Field(() => Int)
  toLearnCount: number;

  @Field(() => Int)
  practicedCount: number;

  @Field(() => Int)
  learnedCount: number;

  @Field(() => Int)
  dueCount: number;

  @Field(() => Int)
  totalCardCount: number;
}
