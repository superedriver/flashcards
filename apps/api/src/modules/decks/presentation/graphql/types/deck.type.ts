import { Field, ObjectType } from '@nestjs/graphql';
import { DeckModerationStatus } from './deck-moderation-status.type';
import { DeckVisibility } from './deck-visibility.type';

@ObjectType('Deck')
export class DeckType {
  @Field()
  id: string;

  @Field()
  ownerId: string;

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

  @Field(() => String, { nullable: true })
  targetLanguage: string | null;

  @Field(() => String, { nullable: true })
  sourceLanguage: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
