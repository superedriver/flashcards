import { PrismaClient } from '../../src/generated/prisma/client';

import { LANGUAGE_CATALOG } from './languages.catalog';

export async function seedLanguages(prisma: PrismaClient): Promise<number> {
  for (const entry of LANGUAGE_CATALOG) {
    await prisma.language.upsert({
      where: { code: entry.code },
      create: {
        code: entry.code,
        englishName: entry.englishName,
        nativeName: entry.nativeName,
        flag: entry.flag,
        popularSortOrder: entry.popularSortOrder,
      },
      update: {
        englishName: entry.englishName,
        nativeName: entry.nativeName,
        flag: entry.flag,
        popularSortOrder: entry.popularSortOrder,
      },
    });
  }

  return LANGUAGE_CATALOG.length;
}
