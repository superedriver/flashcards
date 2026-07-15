import { Field, ObjectType } from '@nestjs/graphql';
import { DeckOrigin } from './deck-origin.type';
import { DeckType } from './deck.type';

@ObjectType('DecksPageDeck')
export class DecksPageDeckType extends DeckType {
  @Field(() => DeckOrigin)
  origin: DeckOrigin;
}
