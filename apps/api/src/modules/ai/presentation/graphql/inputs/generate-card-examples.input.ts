import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GenerateCardExamplesInput {
  @Field()
  cardId: string;

  @Field(() => String, { nullable: true })
  locale?: string | null;
}
