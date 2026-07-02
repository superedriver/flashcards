import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AbandonLessonPayload')
export class AbandonLessonPayloadType {
  @Field()
  success: boolean;
}
