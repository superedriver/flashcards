import { Field, ObjectType } from '@nestjs/graphql';
import { SafeUserType } from './safe-user.type';

@ObjectType()
export class AuthPayloadType {
  @Field(() => SafeUserType)
  user: SafeUserType;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
