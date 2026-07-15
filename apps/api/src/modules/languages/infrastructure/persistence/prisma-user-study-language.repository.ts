import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import { UserStudyLanguageRepositoryPort } from '../../application/ports/user-study-language-repository.port';
import { UserStudyLanguage } from '../../domain/types';
import { toUserStudyLanguage } from '../mappers/user-study-language.mapper';

@Injectable()
export class PrismaUserStudyLanguageRepository implements UserStudyLanguageRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserStudyLanguage[]> {
    const records = await this.prisma.userStudyLanguage.findMany({
      where: { userId },
      include: { language: true },
      orderBy: { createdAt: 'desc' },
    });

    return records.map(toUserStudyLanguage);
  }

  async findByUserIdAndCode(
    userId: string,
    languageCode: string,
  ): Promise<UserStudyLanguage | null> {
    const record = await this.prisma.userStudyLanguage.findUnique({
      where: {
        userId_languageCode: {
          userId,
          languageCode,
        },
      },
      include: { language: true },
    });

    return record ? toUserStudyLanguage(record) : null;
  }

  async upsert(
    userId: string,
    languageCode: string,
  ): Promise<UserStudyLanguage> {
    const record = await this.prisma.userStudyLanguage.upsert({
      where: {
        userId_languageCode: {
          userId,
          languageCode,
        },
      },
      create: {
        userId,
        languageCode,
      },
      update: {},
      include: { language: true },
    });

    return toUserStudyLanguage(record);
  }

  async delete(userId: string, languageCode: string): Promise<void> {
    await this.prisma.userStudyLanguage.delete({
      where: {
        userId_languageCode: {
          userId,
          languageCode,
        },
      },
    });
  }
}
