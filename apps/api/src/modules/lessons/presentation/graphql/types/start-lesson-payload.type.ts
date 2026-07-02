import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LessonCardType } from './lesson-card.type';

@ObjectType('StartLessonPayload')
export class StartLessonPayloadType {
  @Field(() => String, { nullable: true })
  sessionId: string | null;

  @Field()
  deckId: string;

  @Field(() => [LessonCardType])
  cards: LessonCardType[];

  @Field(() => Int)
  lessonSize: number;

  @Field(() => Int)
  totalCards: number;
}
