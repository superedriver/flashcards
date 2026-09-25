import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LinkOAuthAccountInput {
  @Field()
  provider: string;

  @Field()
  token: string;
}
