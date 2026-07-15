import {
  Language as PrismaLanguage,
  UserStudyLanguage as PrismaUserStudyLanguage,
} from '../../../../generated/prisma/client';
import { UserStudyLanguage } from '../../domain/types';
import { toLanguage } from './language.mapper';

type PrismaUserStudyLanguageWithLanguage = PrismaUserStudyLanguage & {
  language: PrismaLanguage;
};

export function toUserStudyLanguage(
  record: PrismaUserStudyLanguageWithLanguage,
): UserStudyLanguage {
  return {
    id: record.id,
    userId: record.userId,
    languageCode: record.languageCode,
    createdAt: record.createdAt,
    language: toLanguage(record.language),
  };
}
