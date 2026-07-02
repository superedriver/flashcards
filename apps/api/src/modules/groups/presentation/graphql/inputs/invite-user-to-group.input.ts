import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class InviteUserToGroupInput {
  @Field()
  groupId: string;

  @Field()
  email: string;
}
