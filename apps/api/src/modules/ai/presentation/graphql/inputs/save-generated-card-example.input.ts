import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SaveGeneratedCardExampleInput {
  @Field()
  cardId: string;

  @Field()
  exampleText: string;
}
