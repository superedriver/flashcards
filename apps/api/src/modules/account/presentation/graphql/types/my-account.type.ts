import { Field, ObjectType } from '@nestjs/graphql';
import { SafeUserType } from '../../../../auth/presentation/graphql/types/safe-user.type';
import { UserStudyLanguageType } from '../../../../languages/presentation/graphql/types/user-study-language.type';
import { UserProfileType } from './user-profile.type';
import { UserSettingsType } from './user-settings.type';

@ObjectType('MyAccount')
export class MyAccountType {
  @Field(() => SafeUserType)
  user: SafeUserType;

  @Field(() => UserProfileType)
  profile: UserProfileType;

  @Field(() => UserSettingsType)
  settings: UserSettingsType;

  @Field(() => [UserStudyLanguageType])
  studyLanguages: UserStudyLanguageType[];

  @Field()
  needsStudyLanguageOnboarding: boolean;
}
