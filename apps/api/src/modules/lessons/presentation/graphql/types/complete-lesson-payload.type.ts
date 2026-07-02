import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('CompleteLessonPayload')
export class CompleteLessonPayloadType {
  @Field()
  sessionId: string;

  @Field()
  deckId: string;

  @Field(() => Int)
  totalCards: number;

  @Field(() => Int)
  reviewedCards: number;

  @Field(() => Int)
  knownCount: number;

  @Field(() => Int)
  dontKnowCount: number;

  @Field()
  completedAt: Date;
}
