import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AdminSearchUsersInput {
  @Field(() => String, { nullable: true })
  query?: string | null;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
