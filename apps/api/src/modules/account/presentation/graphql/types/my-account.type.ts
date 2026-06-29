import { Field, ObjectType } from '@nestjs/graphql';
import { SafeUserType } from '../../../../auth/presentation/graphql/types/safe-user.type';
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
}
