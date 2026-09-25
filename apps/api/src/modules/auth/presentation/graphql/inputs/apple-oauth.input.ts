import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AppleOAuthInput {
  @Field()
  identityToken: string;
}
