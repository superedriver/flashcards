import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AbandonLessonInput {
  @Field()
  sessionId: string;
}
