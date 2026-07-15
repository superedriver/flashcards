import { Inject, Injectable } from '@nestjs/common';
import { Language } from '../../domain/types';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepositoryPort,
} from '../ports/language-repository.port';

export type ListLanguagesUseCaseInput = {
  search?: string | null;
};

export type ListLanguagesUseCaseResult = Language[];

@Injectable()
export class ListLanguagesUseCase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepositoryPort,
  ) {}

  async execute(
    input: ListLanguagesUseCaseInput,
  ): Promise<ListLanguagesUseCaseResult> {
    const search = this.normalizeSearch(input.search);

    return this.languageRepository.findAll({ search });
  }

  private normalizeSearch(search?: string | null): string | null {
    if (search == null) {
      return null;
    }

    const trimmed = search.trim();

    return trimmed.length > 0 ? trimmed : null;
  }
}
