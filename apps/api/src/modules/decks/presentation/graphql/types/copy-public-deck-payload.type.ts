import { Field, ObjectType } from '@nestjs/graphql';
import { CardType } from './card.type';
import { DeckType } from './deck.type';

@ObjectType('CopyPublicDeckPayload')
export class CopyPublicDeckPayloadType {
  @Field(() => DeckType)
  deck: DeckType;

  @Field(() => [CardType])
  cards: CardType[];
}
