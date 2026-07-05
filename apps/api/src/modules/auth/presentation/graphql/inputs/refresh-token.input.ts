import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshTokenInput {
  @Field({ nullable: true })
  refreshToken?: string;
}
