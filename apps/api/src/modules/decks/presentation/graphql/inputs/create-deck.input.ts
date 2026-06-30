import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDeckInput {
  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string | null;
}
