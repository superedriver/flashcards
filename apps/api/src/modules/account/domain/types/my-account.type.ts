import { SafeUser } from '../../../auth/domain/types';
import { UserStudyLanguageListItem } from '../../../languages/domain/types';
import { UserProfile } from './user-profile.type';
import { UserSettings } from './user-settings.type';

export type MyAccount = {
  user: SafeUser;
  profile: UserProfile;
  settings: UserSettings;
  studyLanguages: UserStudyLanguageListItem[];
  needsStudyLanguageOnboarding: boolean;
};
