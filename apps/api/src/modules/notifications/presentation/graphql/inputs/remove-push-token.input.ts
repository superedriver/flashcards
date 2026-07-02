import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemovePushTokenInput {
  @Field()
  token: string;
}
