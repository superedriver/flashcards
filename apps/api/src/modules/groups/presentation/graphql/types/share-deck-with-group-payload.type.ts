import { Field, ObjectType } from '@nestjs/graphql';
import { DeckGroupShareType } from './deck-group-share.type';

@ObjectType('ShareDeckWithGroupPayload')
export class ShareDeckWithGroupPayloadType {
  @Field(() => DeckGroupShareType)
  share: DeckGroupShareType;
}
