import { Field, ObjectType } from '@nestjs/graphql';
import { LanguageType } from './language.type';

@ObjectType('UserStudyLanguage')
export class UserStudyLanguageType {
  @Field()
  languageCode: string;

  @Field(() => LanguageType)
  language: LanguageType;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;
}
