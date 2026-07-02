import { Field, ObjectType } from '@nestjs/graphql';
import { DeckGroupSharePermission } from './deck-group-share-permission.type';

@ObjectType('DeckGroupShare')
export class DeckGroupShareType {
  @Field()
  id: string;

  @Field()
  deckId: string;

  @Field()
  groupId: string;

  @Field(() => DeckGroupSharePermission)
  permission: DeckGroupSharePermission;

  @Field()
  createdById: string;

  @Field()
  createdAt: Date;
}
