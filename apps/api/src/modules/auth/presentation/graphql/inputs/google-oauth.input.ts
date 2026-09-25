import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GoogleOAuthInput {
  @Field()
  idToken: string;
}
