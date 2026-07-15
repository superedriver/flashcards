import { Field, ObjectType } from '@nestjs/graphql';
import { DeckLanguageWarningType } from './deck-language-warning.type';
import { DeckType } from './deck.type';

@ObjectType('CreateDeckPayload')
export class CreateDeckPayloadType {
  @Field(() => DeckType)
  deck: DeckType;

  @Field(() => [DeckLanguageWarningType])
  warnings: DeckLanguageWarningType[];
}
