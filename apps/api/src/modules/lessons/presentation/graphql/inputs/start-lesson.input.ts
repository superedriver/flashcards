import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class StartLessonInput {
  @Field()
  deckId: string;

  @Field(() => Int, { nullable: true })
  lessonSize?: number;
}
