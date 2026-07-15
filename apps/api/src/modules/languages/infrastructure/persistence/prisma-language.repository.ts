import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  LanguageRepositoryPort,
  ListLanguagesInput,
} from '../../application/ports/language-repository.port';
import { Language } from '../../domain/types';
import { toLanguage } from '../mappers/language.mapper';

@Injectable()
export class PrismaLanguageRepository implements LanguageRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(input: ListLanguagesInput): Promise<Language[]> {
    const search = input.search?.trim();

    const where: Prisma.LanguageWhereInput | undefined =
      search && search.length > 0
        ? {
            OR: [
              {
                englishName: { contains: search, mode: 'insensitive' },
              },
              {
                nativeName: { contains: search, mode: 'insensitive' },
              },
              {
                code: { contains: search, mode: 'insensitive' },
              },
            ],
          }
        : undefined;

    const languages = await this.prisma.language.findMany({
      where,
      orderBy: [
        { popularSortOrder: { sort: 'asc', nulls: 'last' } },
        { englishName: 'asc' },
      ],
    });

    return languages.map(toLanguage);
  }
}
