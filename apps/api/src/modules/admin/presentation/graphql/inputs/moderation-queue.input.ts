import { Field, InputType, Int } from '@nestjs/graphql';
import { DeckModerationStatus } from '../../../../decks/presentation/graphql/types/deck-moderation-status.type';

@InputType()
export class ModerationQueueInput {
  @Field(() => DeckModerationStatus, { nullable: true })
  status?: DeckModerationStatus | null;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
