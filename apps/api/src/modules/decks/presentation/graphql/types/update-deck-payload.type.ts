import { Field, ObjectType } from '@nestjs/graphql';
import { DeckLanguageWarningType } from './deck-language-warning.type';
import { DeckType } from './deck.type';

@ObjectType('UpdateDeckPayload')
export class UpdateDeckPayloadType {
  @Field(() => DeckType)
  deck: DeckType;

  @Field(() => [DeckLanguageWarningType])
  warnings: DeckLanguageWarningType[];
}
