import { Field, ObjectType } from '@nestjs/graphql';
import { ModerationDeckType } from './moderation-deck.type';

@ObjectType('ModerationQueueResult')
export class ModerationQueueResultType {
  @Field(() => [ModerationDeckType])
  items: ModerationDeckType[];

  @Field()
  total: number;
}
