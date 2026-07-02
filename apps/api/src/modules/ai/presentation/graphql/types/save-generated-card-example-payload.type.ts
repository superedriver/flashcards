import { Field, ObjectType } from '@nestjs/graphql';
import { CardType } from '../../../../decks/presentation/graphql/types/card.type';

@ObjectType('SaveGeneratedCardExamplePayload')
export class SaveGeneratedCardExamplePayloadType {
  @Field(() => CardType)
  card: CardType;
}
