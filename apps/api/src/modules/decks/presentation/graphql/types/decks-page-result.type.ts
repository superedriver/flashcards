import { Field, ObjectType } from '@nestjs/graphql';
import { DecksPageDeckType } from './decks-page-deck.type';

@ObjectType('DecksPageResult')
export class DecksPageResultType {
  @Field(() => [DecksPageDeckType])
  ownDecks: DecksPageDeckType[];

  @Field(() => [DecksPageDeckType])
  groupDecks: DecksPageDeckType[];

  @Field(() => [DecksPageDeckType])
  publicDecks: DecksPageDeckType[];

  @Field(() => [DecksPageDeckType])
  noLanguageDecks: DecksPageDeckType[];
}
