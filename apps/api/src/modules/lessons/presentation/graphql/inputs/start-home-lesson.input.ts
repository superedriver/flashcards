import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class StartHomeLessonInput {
  @Field(() => Int, { nullable: true })
  lessonSize?: number;
}
