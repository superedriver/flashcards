import { UserStudyLanguage } from '../../domain/types';

export const USER_STUDY_LANGUAGE_REPOSITORY = Symbol(
  'USER_STUDY_LANGUAGE_REPOSITORY',
);

export type UserStudyLanguageRepositoryPort = {
  findByUserId(userId: string): Promise<UserStudyLanguage[]>;
  findByUserIdAndCode(
    userId: string,
    languageCode: string,
  ): Promise<UserStudyLanguage | null>;
  upsert(userId: string, languageCode: string): Promise<UserStudyLanguage>;
  delete(userId: string, languageCode: string): Promise<void>;
};
