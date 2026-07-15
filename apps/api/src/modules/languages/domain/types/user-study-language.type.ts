import { Language } from './language.type';

export type UserStudyLanguage = {
  id: string;
  userId: string;
  languageCode: string;
  createdAt: Date;
  language: Language;
};

export type UserStudyLanguageListItem = UserStudyLanguage & {
  isActive: boolean;
};
