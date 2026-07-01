import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DeckType } from './deck.type';

@ObjectType('PublicDeckSearchResult')
export class PublicDeckSearchResultType {
  @Field(() => [DeckType])
  items: DeckType[];

  @Field(() => Int)
  total: number;
}
