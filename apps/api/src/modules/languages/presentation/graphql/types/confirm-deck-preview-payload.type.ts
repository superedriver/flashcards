import { Field, ObjectType } from '@nestjs/graphql';
import { CardType } from '../../../../decks/presentation/graphql/types/card.type';
import { DeckType } from '../../../../decks/presentation/graphql/types/deck.type';

@ObjectType('ConfirmDeckPreviewPayload')
export class ConfirmDeckPreviewPayloadType {
  @Field(() => DeckType)
  deck: DeckType;

  @Field(() => [CardType])
  cards: CardType[];
}
