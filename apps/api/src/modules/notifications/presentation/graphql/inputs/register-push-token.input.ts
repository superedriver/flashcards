import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterPushTokenInput {
  @Field()
  token: string;

  @Field(() => String, { nullable: true })
  deviceId?: string | null;

  @Field(() => String, { nullable: true })
  platform?: string | null;
}
