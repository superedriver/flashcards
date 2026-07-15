import { Field, ObjectType } from '@nestjs/graphql';
import { UserStudyLanguageType } from './user-study-language.type';

@ObjectType('CompleteStudyLanguageOnboardingPayload')
export class CompleteStudyLanguageOnboardingPayloadType {
  @Field(() => [UserStudyLanguageType])
  studyLanguages: UserStudyLanguageType[];

  @Field()
  needsStudyLanguageOnboarding: boolean;
}
