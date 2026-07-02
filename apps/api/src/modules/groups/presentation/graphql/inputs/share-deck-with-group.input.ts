import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ShareDeckWithGroupInput {
  @Field()
  deckId: string;

  @Field()
  groupId: string;
}
