import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('DeckLearningStats')
export class DeckLearningStatsType {
  @Field()
  deckId: string;

  @Field(() => Int)
  totalCards: number;

  @Field(() => Int)
  newCards: number;

  @Field(() => Int)
  dueCards: number;

  @Field(() => Int)
  reviewedCards: number;

  @Field(() => Date, { nullable: true })
  nextDueAt: Date | null;
}
