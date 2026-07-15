import { Language } from '../../domain/types';

export const LANGUAGE_REPOSITORY = Symbol('LANGUAGE_REPOSITORY');

export type ListLanguagesInput = {
  search?: string | null;
};

export type LanguageRepositoryPort = {
  findAll(input: ListLanguagesInput): Promise<Language[]>;
  findByCode(code: string): Promise<Language | null>;
};
