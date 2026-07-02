import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterPushTokenPayloadType {
  @Field()
  success: boolean;
}
