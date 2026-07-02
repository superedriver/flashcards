import { Field, ObjectType } from '@nestjs/graphql';
import { DeckModerationStatus } from '../../../../decks/presentation/graphql/types/deck-moderation-status.type';
import { DeckVisibility } from '../../../../decks/presentation/graphql/types/deck-visibility.type';

@ObjectType('ModerationDeck')
export class ModerationDeckType {
  @Field()
  id: string;

  @Field()
  ownerId: string;

  @Field()
  ownerEmail: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => DeckVisibility)
  visibility: DeckVisibility;

  @Field(() => DeckModerationStatus)
  moderationStatus: DeckModerationStatus;

  @Field()
  isOfficial: boolean;

  @Field(() => String, { nullable: true })
  sourceDeckId: string | null;

  @Field()
  cardCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
