import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CompleteStudyLanguageOnboardingInput {
  @Field()
  targetLanguage: string;

  @Field()
  nativeLanguage: string;
}
