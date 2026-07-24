import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LessonCardType } from './lesson-card.type';

export enum StudySessionScopeGql {
  DECK = 'DECK',
  HOME_ACTIVE_TARGET = 'HOME_ACTIVE_TARGET',
}

registerEnumType(StudySessionScopeGql, {
  name: 'StudySessionScope',
});

@ObjectType('StartLessonPayload')
export class StartLessonPayloadType {
  @Field(() => String, { nullable: true })
  sessionId: string | null;

  @Field(() => String, { nullable: true })
  deckId: string | null;

  @Field(() => StudySessionScopeGql)
  scope: StudySessionScopeGql;

  @Field(() => [LessonCardType])
  cards: LessonCardType[];

  @Field(() => Int)
  lessonSize: number;

  @Field(() => Int)
  totalCards: number;
}
