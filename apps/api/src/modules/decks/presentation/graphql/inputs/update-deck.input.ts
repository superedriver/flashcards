import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateDeckInput {
  @Field()
  deckId: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field({ nullable: true })
  targetLanguage?: string;

  @Field({ nullable: true })
  sourceLanguage?: string;
}
