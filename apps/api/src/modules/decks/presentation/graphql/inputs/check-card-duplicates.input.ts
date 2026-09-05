import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CheckCardDuplicatesPairInput {
  @Field()
  front: string;

  @Field()
  back: string;
}

@InputType()
export class CheckCardDuplicatesInput {
  @Field()
  deckId: string;

  @Field(() => [CheckCardDuplicatesPairInput])
  pairs: CheckCardDuplicatesPairInput[];
}
