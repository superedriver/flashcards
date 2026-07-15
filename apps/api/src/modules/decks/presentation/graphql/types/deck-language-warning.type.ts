import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum DeckLanguageWarningCode {
  SOURCE_TARGET_SAME = 'SOURCE_TARGET_SAME',
}

registerEnumType(DeckLanguageWarningCode, {
  name: 'DeckLanguageWarningCode',
});

@ObjectType('DeckLanguageWarning')
export class DeckLanguageWarningType {
  @Field(() => DeckLanguageWarningCode)
  code: DeckLanguageWarningCode;

  @Field()
  message: string;
}
