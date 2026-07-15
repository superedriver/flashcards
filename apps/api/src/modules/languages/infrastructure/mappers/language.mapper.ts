import { Language as PrismaLanguage } from '../../../../generated/prisma/client';
import { Language } from '../../domain/types';

export function toLanguage(record: PrismaLanguage): Language {
  return {
    code: record.code,
    englishName: record.englishName,
    nativeName: record.nativeName,
    flag: record.flag,
    popularSortOrder: record.popularSortOrder,
  };
}
