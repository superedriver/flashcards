import { Module } from '@nestjs/common';
import { LANGUAGE_REPOSITORY } from './application/ports/language-repository.port';
import { ListLanguagesUseCase } from './application/use-cases/list-languages.use-case';
import { PrismaLanguageRepository } from './infrastructure/persistence/prisma-language.repository';
import { LanguagesResolver } from './presentation/graphql/resolvers/languages.resolver';

@Module({
  providers: [
    {
      provide: LANGUAGE_REPOSITORY,
      useClass: PrismaLanguageRepository,
    },
    ListLanguagesUseCase,
    LanguagesResolver,
  ],
  exports: [LANGUAGE_REPOSITORY, ListLanguagesUseCase],
})
export class LanguagesModule {}
