import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CompleteLessonInput {
  @Field()
  sessionId: string;
}
