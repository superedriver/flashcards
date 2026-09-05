import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DisableAudioOnlyInput {
  @Field()
  sessionId: string;

  @Field()
  cardId: string;
}
